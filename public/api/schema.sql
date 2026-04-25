-- Создание таблицы серверов
-- Выполни этот SQL в phpMyAdmin на Timeweb

CREATE TABLE IF NOT EXISTS `servers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `chronicle` VARCHAR(100) NOT NULL,
  `rate` INT DEFAULT NULL,
  `category` VARCHAR(50) DEFAULT NULL COMMENT 'gve, rvr и тд (если rate = null)',
  `start_date` DATE NOT NULL,
  `card_type` ENUM('basic', 'top', 'vip', 'vip-plus', 'premium') NOT NULL DEFAULT 'basic',
  `icons` JSON DEFAULT NULL COMMENT '["hot-start", "recommended"]',
  `server_types` JSON DEFAULT NULL COMMENT '["pvp", "gve", "low-rate"]',
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `contacts` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATE DEFAULT NULL COMMENT 'Дата окончания платного размещения',
  `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_start_date` (`start_date`),
  INDEX `idx_card_type` (`card_type`),
  INDEX `idx_chronicle` (`chronicle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица кликов (трекинг переходов)
CREATE TABLE IF NOT EXISTS `clicks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `server_id` INT UNSIGNED NOT NULL,
  `ip` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(512) DEFAULT NULL,
  `referer` VARCHAR(512) DEFAULT NULL,
  `clicked_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_server_id` (`server_id`),
  INDEX `idx_clicked_at` (`clicked_at`),
  CONSTRAINT `fk_clicks_server` FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица для админа
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Сессии админов (логин/пароль → токен)
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `token` CHAR(64) NOT NULL UNIQUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  `last_used_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_token` (`token`),
  INDEX `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================================
-- Цены ресурсов (Lineage 2 Interlude)
-- ===========================================================

CREATE TABLE IF NOT EXISTS `resources` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(64) NOT NULL UNIQUE,
  `name` VARCHAR(128) NOT NULL,
  `icon` VARCHAR(64) NOT NULL COMMENT 'имя файла в /img/resources/',
  `category` ENUM('drop','craft_or_drop','craft_or_manor','craft_only','s_grade') NOT NULL,
  `recipe` JSON DEFAULT NULL COMMENT '[{"slug":"...","qty":N}, ...]',
  `yield_qty` INT NOT NULL DEFAULT 1 COMMENT 'сколько штук на выходе крафта',
  `sort_order` INT NOT NULL DEFAULT 0,

  `buy_avg`  BIGINT DEFAULT NULL COMMENT 'средняя цена покупки',
  `buy_max`  BIGINT DEFAULT NULL COMMENT 'максимальная цена покупки (NULL → buy_avg)',
  `sell_avg` BIGINT DEFAULT NULL COMMENT 'средняя цена продажи',
  `sell_min` BIGINT DEFAULT NULL COMMENT 'минимальная цена продажи (NULL → sell_avg)',

  `buy_updated_at`  DATETIME DEFAULT NULL,
  `sell_updated_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- История изменений цен
CREATE TABLE IF NOT EXISTS `price_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `resource_id` INT UNSIGNED NOT NULL,
  `field` ENUM('buy_avg','buy_max','sell_avg','sell_min') NOT NULL,
  `old_value` BIGINT DEFAULT NULL,
  `new_value` BIGINT DEFAULT NULL,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `changed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_resource_changed` (`resource_id`, `changed_at`),
  INDEX `idx_resource_field` (`resource_id`, `field`, `changed_at`),
  CONSTRAINT `fk_history_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_history_user` FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
