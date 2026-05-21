<?php
// Перепроверка подписки на канал по сессионному токену.
// Используется кнопкой «Я подписался» во фронтенде.
require __DIR__ . '/lib.php';
require __DIR__ . '/db.php';

$cfg = load_config();
cors_and_json($cfg);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}

$body = read_json_body();
$token = (string) ($body['token'] ?? '');
if ($token === '') {
    send_json(['error' => 'bad_request'], 400);
}

$pdo = comments_db($cfg);
$stmt = $pdo->prepare("SELECT tg_id FROM comment_sessions WHERE token = ? AND expires_at > NOW()");
$stmt->execute([$token]);
$row = $stmt->fetch();
if (!$row) {
    send_json(['error' => 'unauthorized'], 401);
}

$subscribed = is_channel_member($cfg['bot_token'], $cfg['channel'], (int) $row['tg_id']);
send_json(['subscribed' => $subscribed]);
