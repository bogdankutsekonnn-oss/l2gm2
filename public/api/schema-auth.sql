-- ===========================================================
-- Единая система пользовательских аккаунтов
-- Вход: Google, Яндекс, Email+пароль, Telegram (объединены в один аккаунт)
-- Выполнить один раз в phpMyAdmin (панель Timeweb → Базы данных).
-- ===========================================================

-- Пользователи (единый аккаунт)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `display_name` VARCHAR(120) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `email_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `photo_url` VARCHAR(512) DEFAULT NULL,
  `password_hash` VARCHAR(255) DEFAULT NULL COMMENT 'только для email-identity',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Способы входа (один аккаунт = несколько провайдеров)
-- provider_uid: google sub / yandex id / telegram id / email (в нижнем регистре)
CREATE TABLE IF NOT EXISTS `user_identities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `provider` ENUM('google','yandex','telegram','email') NOT NULL,
  `provider_uid` VARCHAR(190) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_provider` (`provider`, `provider_uid`),
  INDEX `idx_user` (`user_id`),
  CONSTRAINT `fk_identities_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Сессии (bearer-токен → пользователь), 30 дней
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `token` CHAR(64) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  `last_used_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`token`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_expires` (`expires_at`),
  CONSTRAINT `fk_user_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Токены подтверждения почты и сброса пароля
CREATE TABLE IF NOT EXISTS `email_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `purpose` ENUM('verify','reset') NOT NULL,
  `token` CHAR(64) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `used_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_token` (`token`),
  INDEX `idx_user_purpose` (`user_id`, `purpose`),
  CONSTRAINT `fk_email_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Одноразовый код для передачи сессии со страницы OAuth-callback на фронт
-- (чтобы реальный токен не светился в URL/логах). Живёт ~2 минуты.
CREATE TABLE IF NOT EXISTS `auth_handoff` (
  `code` CHAR(48) NOT NULL,
  `token` CHAR(64) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================================
-- МИГРАЦИЯ: объединение существующих Telegram-аккаунтов комментариев
-- в единую систему. Безопасно запускать повторно (idempotent).
-- Таблицы servers/clicks не затрагиваются.
-- ===========================================================

-- 1) Перенос пользователей комментариев в users.
--    display_name = "Имя Фамилия" (без лишних пробелов), photo_url переносим.
INSERT INTO `users` (`display_name`, `photo_url`, `created_at`)
SELECT
  NULLIF(TRIM(CONCAT(cu.first_name, ' ', cu.last_name)), ''),
  NULLIF(cu.photo_url, ''),
  cu.created_at
FROM `comment_users` cu
WHERE NOT EXISTS (
  SELECT 1 FROM `user_identities` ui
  WHERE ui.provider = 'telegram' AND ui.provider_uid = CAST(cu.tg_id AS CHAR)
);

-- 2) Привязка identity telegram к только что созданным users.
--    Матчим по имени+дате создания — на переходе достаточно, дальше вход идёт через auth-api.
INSERT INTO `user_identities` (`user_id`, `provider`, `provider_uid`, `created_at`)
SELECT u.id, 'telegram', CAST(cu.tg_id AS CHAR), cu.created_at
FROM `comment_users` cu
JOIN `users` u
  ON u.created_at = cu.created_at
 AND ( (u.display_name IS NULL AND NULLIF(TRIM(CONCAT(cu.first_name,' ',cu.last_name)),'') IS NULL)
       OR u.display_name = NULLIF(TRIM(CONCAT(cu.first_name,' ',cu.last_name)),'') )
WHERE NOT EXISTS (
  SELECT 1 FROM `user_identities` ui
  WHERE ui.provider = 'telegram' AND ui.provider_uid = CAST(cu.tg_id AS CHAR)
);

-- 3) Добавляем comments.user_id и бэкфилим по tg_id → user_identities.
--    Колонку добавляем только если её ещё нет (проверьте вручную; ALTER повторно упадёт с ошибкой — это ок).
ALTER TABLE `comments` ADD COLUMN `user_id` INT UNSIGNED DEFAULT NULL AFTER `tg_id`;
ALTER TABLE `comments` ADD INDEX `idx_user_id` (`user_id`);

UPDATE `comments` c
JOIN `user_identities` ui
  ON ui.provider = 'telegram' AND ui.provider_uid = CAST(c.tg_id AS CHAR)
SET c.user_id = ui.user_id
WHERE c.user_id IS NULL;
