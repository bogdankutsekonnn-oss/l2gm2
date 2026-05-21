<?php
// Добавление комментария. Требует валидную сессию и подписку на канал.
require __DIR__ . '/lib.php';
require __DIR__ . '/db.php';

$cfg = load_config();
cors_and_json($cfg);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}

$body = read_json_body();
$token = (string) ($body['token'] ?? '');
$news = clean_slug($body['news'] ?? '');
$text = trim((string) ($body['text'] ?? ''));

if ($token === '' || $news === '' || $text === '') {
    send_json(['error' => 'bad_request'], 400);
}
if (mb_strlen($text) > 2000) {
    send_json(['error' => 'too_long'], 400);
}

$pdo = comments_db($cfg);

// валидация сессии
$stmt = $pdo->prepare("SELECT tg_id FROM comment_sessions WHERE token = ? AND expires_at > NOW()");
$stmt->execute([$token]);
$row = $stmt->fetch();
if (!$row) {
    send_json(['error' => 'unauthorized'], 401);
}
$tgId = (int) $row['tg_id'];

// перепроверка подписки (пользователь мог отписаться)
if (!is_channel_member($cfg['bot_token'], $cfg['channel'], $tgId)) {
    send_json(['error' => 'not_subscribed'], 403);
}

// антифлуд: не чаще 1 комментария в 15 секунд
$stmt = $pdo->prepare("SELECT created_at FROM comments WHERE tg_id = ? ORDER BY created_at DESC LIMIT 1");
$stmt->execute([$tgId]);
$last = $stmt->fetchColumn();
if ($last && (time() - strtotime($last)) < 15) {
    send_json(['error' => 'too_fast'], 429);
}

// вставка
$stmt = $pdo->prepare(
    "INSERT INTO comments (news_slug, tg_id, text, created_at, hidden)
     VALUES (?, ?, ?, NOW(), 0)"
);
$stmt->execute([$news, $tgId, $text]);
$id = (int) $pdo->lastInsertId();

// вернуть созданный комментарий
$stmt = $pdo->prepare(
    "SELECT c.id, c.text, c.created_at,
            u.first_name, u.last_name, u.username, u.photo_url
     FROM comments c
     JOIN comment_users u ON u.tg_id = c.tg_id
     WHERE c.id = ?"
);
$stmt->execute([$id]);

send_json(['comment' => $stmt->fetch()]);
