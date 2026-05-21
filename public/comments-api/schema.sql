-- Таблицы для системы комментариев.
-- Выполните один раз в phpMyAdmin (панель Timeweb → Базы данных → phpMyAdmin).

CREATE TABLE IF NOT EXISTS comment_users (
  tg_id      BIGINT       NOT NULL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL DEFAULT '',
  last_name  VARCHAR(255) NOT NULL DEFAULT '',
  username   VARCHAR(255) NOT NULL DEFAULT '',
  photo_url  TEXT,
  created_at DATETIME     NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS comment_sessions (
  token      CHAR(64) NOT NULL PRIMARY KEY,
  tg_id      BIGINT   NOT NULL,
  expires_at DATETIME NOT NULL,
  KEY idx_tg (tg_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS comments (
  id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  news_slug  VARCHAR(255) NOT NULL,
  tg_id      BIGINT       NOT NULL,
  text       TEXT         NOT NULL,
  created_at DATETIME     NOT NULL,
  hidden     TINYINT      NOT NULL DEFAULT 0,
  KEY idx_news (news_slug, hidden),
  KEY idx_user (tg_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
