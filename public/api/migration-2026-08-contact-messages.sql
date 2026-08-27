-- Таблица сообщений из формы «О нас» (август 2026).
-- Выполнить один раз в phpMyAdmin на Timeweb ВМЕСТЕ с деплоем contact.php.
--
-- Зачем: форма слала сообщение сразу в Telegram и нигде его не сохраняла.
-- Хостинг до api.telegram.org не достаёт (исходящие на 443 виснут по
-- таймауту), поэтому каждое письмо просто пропадало — посетитель видел
-- ошибку, а до нас не доходило ничего.
--
-- Теперь contact.php кладёт сообщение сюда, а scripts/notify-pending.js
-- забирает и отправляет в чат с раннера GitHub Actions.

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `reply` VARCHAR(255) DEFAULT NULL COMMENT 'как ответить: почта, телега и тд',
  `message` TEXT NOT NULL,
  `ip` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
