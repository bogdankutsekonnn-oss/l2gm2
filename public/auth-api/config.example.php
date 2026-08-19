<?php
// ШАБЛОН КОНФИГА пользовательской авторизации.
// Скопируйте в config.php и заполните. config.php НЕ коммитится (в .gitignore),
// на проде он генерируется из GitHub Secrets в .github/workflows/deploy.yml.
//
//   cp config.example.php config.php
//
return [
    // --- MySQL (та же база, что у остального API) ---
    'db_host' => 'localhost',
    'db_name' => 'damonlaptev_servers',
    'db_user' => 'damonlaptev_servers',
    'db_pass' => 'ВАШ_DB_PASS',

    // --- Google OAuth (Google Cloud Console → Credentials → OAuth client ID, тип Web) ---
    // Authorized redirect URI: https://l2gm.com/auth-api/google/callback.php
    'google_client_id'     => 'ВАШ_GOOGLE_CLIENT_ID',
    'google_client_secret' => 'ВАШ_GOOGLE_CLIENT_SECRET',

    // --- Yandex OAuth (oauth.yandex.ru → создать приложение) ---
    // Redirect URI: https://l2gm.com/auth-api/yandex/callback.php
    // Права: login:email, login:info, login:avatar
    'yandex_client_id'     => 'ВАШ_YANDEX_CLIENT_ID',
    'yandex_client_secret' => 'ВАШ_YANDEX_CLIENT_SECRET',

    // --- SMTP для писем (подтверждение почты, сброс пароля) ---
    // Ящик из панели Timeweb (Почта). Порт 465 = implicit SSL.
    'smtp_host' => 'ВАШ_SMTP_HOST',   // напр. smtp.timeweb.ru
    'smtp_port' => 465,
    'smtp_user' => 'ВАШ_SMTP_USER',   // напр. no-reply@l2gm.com
    'smtp_pass' => 'ВАШ_SMTP_PASS',
    'smtp_from' => 'no-reply@l2gm.com',
    'smtp_from_name' => 'L2GM',

    // --- Домен сайта ---
    'redirect_base' => 'https://l2gm.com', // база для redirect_uri и ссылок в письмах
    'allow_origin'  => 'https://l2gm.com', // CORS

    // --- Telegram (тот же бот, что в comments-api) ---
    'telegram_bot_token' => 'ВАШ_COMMENTS_BOT_TOKEN',
    'telegram_channel'   => '@l2gm_official',
];
