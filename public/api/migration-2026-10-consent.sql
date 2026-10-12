-- Отметка о согласии заявителя с Правилами размещения и на обработку
-- персональных данных. Заполняется в servers.php при подаче заявки с сайта.
-- Применить один раз в phpMyAdmin. Пока колонок нет, заявки и сообщения
-- сохраняются как раньше — теряется только отметка о согласии.

ALTER TABLE `servers`
  ADD COLUMN `consent_at` DATETIME NULL DEFAULT NULL COMMENT 'Когда заявитель принял правила и дал согласие на обработку ПД';

ALTER TABLE `contact_messages`
  ADD COLUMN `consent_at` DATETIME NULL DEFAULT NULL COMMENT 'Когда отправитель дал согласие на обработку ПД';
