<?php
// Авторизация через Telegram Login Widget.
// Принимает JSON с полями виджета (id, first_name, ..., hash),
// проверяет подпись, проверяет подписку на канал, выдаёт сессионный токен.
require __DIR__ . '/lib.php';
require __DIR__ . '/db.php';

$cfg = load_config();
cors_and_json($cfg);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}

$body = read_json_body();

if (!verify_telegram_auth($body, $cfg['bot_token'])) {
    send_json(['error' => 'bad_auth'], 403);
}

$tgId = (int) $body['id'];
$pdo = comments_db($cfg);

// upsert пользователя
$stmt = $pdo->prepare(
    "INSERT INTO comment_users (tg_id, first_name, last_name, username, photo_url, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE
        first_name = VALUES(first_name),
        last_name  = VALUES(last_name),
        username   = VALUES(username),
        photo_url  = VALUES(photo_url)"
);
$stmt->execute([
    $tgId,
    (string) ($body['first_name'] ?? ''),
    (string) ($body['last_name'] ?? ''),
    (string) ($body['username'] ?? ''),
    (string) ($body['photo_url'] ?? ''),
]);

$subscribed = is_channel_member($cfg['bot_token'], $cfg['channel'], $tgId);

// новая сессия на 30 дней
$token = bin2hex(random_bytes(32));
$stmt = $pdo->prepare(
    "INSERT INTO comment_sessions (token, tg_id, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))"
);
$stmt->execute([$token, $tgId]);

send_json([
    'token' => $token,
    'subscribed' => $subscribed,
    'user' => [
        'id' => $tgId,
        'first_name' => (string) ($body['first_name'] ?? ''),
        'last_name' => (string) ($body['last_name'] ?? ''),
        'username' => (string) ($body['username'] ?? ''),
        'photo_url' => (string) ($body['photo_url'] ?? ''),
    ],
]);
