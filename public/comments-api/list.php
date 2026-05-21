<?php
// Публичный список комментариев для новости.
require __DIR__ . '/lib.php';
require __DIR__ . '/db.php';

$cfg = load_config();
cors_and_json($cfg);

$news = clean_slug($_GET['news'] ?? '');
if ($news === '') {
    send_json(['comments' => []]);
}

$pdo = comments_db($cfg);
$stmt = $pdo->prepare(
    "SELECT c.id, c.text, c.created_at,
            u.first_name, u.last_name, u.username, u.photo_url
     FROM comments c
     JOIN comment_users u ON u.tg_id = c.tg_id
     WHERE c.news_slug = ? AND c.hidden = 0
     ORDER BY c.created_at ASC
     LIMIT 500"
);
$stmt->execute([$news]);

send_json(['comments' => $stmt->fetchAll()]);
