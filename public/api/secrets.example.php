<?php
// ШАБЛОН секретов для public/api/.
// На проде secrets.php генерируется при деплое из GitHub Secrets
// (DB_PASS, ADMIN_TOKEN, ZAYAVKI_BOT_TOKEN). Этот файл — только справка.
//
// Для локали: скопируйте в secrets.php и впишите значения.
define('DB_PASS', 'ПАРОЛЬ_БД');
define('ADMIN_TOKEN', 'АДМИН_ТОКЕН_ПАНЕЛИ');
define('TG_BOT_TOKEN', 'ТОКЕН_БОТА_ЗАЯВОК');
