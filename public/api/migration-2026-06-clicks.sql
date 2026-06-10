-- Миграция таблицы clicks под key-based трекинг (июнь 2026).
-- Выполнить один раз в phpMyAdmin на Timeweb ДО/СРАЗУ ПОСЛЕ деплоя click.php.
--
-- Что меняется:
--   * server_id становится NULL-able: клики по скрейпленным серверам
--     (которых нет в админ-базе) раньше молча терялись, теперь пишутся;
--   * server_key — нормализованный ключ "url|хроника|рейт" (тот же формат,
--     что в scripts/sync-from-db.js), по нему агрегируется статистика;
--   * server_name — имя на момент клика, чтобы статистика читалась
--     даже для серверов, удалённых из базы.

ALTER TABLE `clicks` DROP FOREIGN KEY `fk_clicks_server`;

ALTER TABLE `clicks`
  MODIFY `server_id` INT UNSIGNED DEFAULT NULL,
  ADD COLUMN `server_key` VARCHAR(300) DEFAULT NULL AFTER `server_id`,
  ADD COLUMN `server_name` VARCHAR(255) DEFAULT NULL AFTER `server_key`,
  ADD INDEX `idx_server_key` (`server_key`),
  ADD CONSTRAINT `fk_clicks_server` FOREIGN KEY (`server_id`)
    REFERENCES `servers`(`id`) ON DELETE SET NULL;

-- Бэкфилл ключей и имён для уже накопленных кликов
UPDATE `clicks` c
JOIN `servers` s ON s.id = c.server_id
SET c.server_key = CONCAT(
      TRIM(TRAILING '/' FROM
        REPLACE(REPLACE(REPLACE(LOWER(s.url), 'https://', ''), 'http://', ''), 'www.', '')),
      '|', s.chronicle, '|', COALESCE(s.category, s.rate, 'null')),
    c.server_name = s.name
WHERE c.server_key IS NULL;
