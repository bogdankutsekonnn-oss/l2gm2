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
