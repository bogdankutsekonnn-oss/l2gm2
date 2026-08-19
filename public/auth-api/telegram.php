<?php
// Вход через Telegram Login Widget в единый аккаунт.
// Проверяет подпись виджета, upsert пользователя, возвращает bearer-токен.
require __DIR__ . '/lib.php';

$cfg = auth_config();
auth_cors($cfg);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}

$body = read_json_body();
if (!verify_telegram_auth($body, $cfg['telegram_bot_token'])) {
    send_json(['error' => 'bad_auth'], 403);
}

$tgId = (string) (int) $body['id'];
$name = trim(((string) ($body['first_name'] ?? '')) . ' ' . ((string) ($body['last_name'] ?? '')));
$photo = (string) ($body['photo_url'] ?? '') ?: null;

$pdo = auth_db($cfg);
$userId = find_or_create_user($pdo, 'telegram', $tgId, null, $name ?: null, $photo, false);

$token = create_session($pdo, $userId);
$u = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$u->execute([$userId]);

send_json([
    'token' => $token,
    'user'  => public_user($pdo, $u->fetch()),
]);
