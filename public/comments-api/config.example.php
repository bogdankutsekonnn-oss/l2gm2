<?php
// ШАБЛОН КОНФИГА. Скопируйте этот файл в config.php и заполните значения.
// config.php НЕ коммитится в git (он в .gitignore) — в нём секреты.
//
//   cp config.example.php config.php   (или скопируйте через файловый менеджер Timeweb)
//
return [
    // --- MySQL (данные из панели Timeweb → Базы данных) ---
    'db_host' => 'localhost',
    'db_name' => 'ВАШ_DB_NAME',
    'db_user' => 'ВАШ_DB_USER',
    'db_pass' => 'ВАШ_DB_PASS',

    // --- Telegram-бот (создать через @BotFather) ---
    // Токен вида 123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    'bot_token' => 'ВАШ_BOT_TOKEN',
    // Имя бота без @ (нужно для виджета логина)
    'bot_username' => 'ВАШ_БОТ_username',

    // --- Канал, подписка на который обязательна для комментирования ---
    // Бот должен быть АДМИНОМ этого канала, иначе getChatMember не работает.
    'channel' => '@l2gm_official',

    // --- Секретный ключ для скрытия комментариев (delete.php) ---
    // Придумайте длинную случайную строку.
    'admin_key' => 'СМЕНИТЕ_НА_ДЛИННУЮ_СЛУЧАЙНУЮ_СТРОКУ',

    // --- Домен сайта (для CORS-заголовка) ---
    'allow_origin' => 'https://l2gm.com',
];
