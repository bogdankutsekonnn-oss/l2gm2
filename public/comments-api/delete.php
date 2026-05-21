<?php
// Скрытие комментария (модерация). Требует admin_key из config.php.
// Пример: /comments-api/delete.php?id=123&key=ВАШ_ADMIN_KEY
require __DIR__ . '/lib.php';
require __DIR__ . '/db.php';

$cfg = load_config();
cors_and_json($cfg);

$key = (string) ($_GET['key'] ?? $_POST['key'] ?? '');
$id = (int) ($_GET['id'] ?? 0);

if ($cfg['admin_key'] === '' || !hash_equals($cfg['admin_key'], $key)) {
    send_json(['error' => 'forbidden'], 403);
}
if ($id <= 0) {
    send_json(['error' => 'bad_request'], 400);
}

$pdo = comments_db($cfg);
$stmt = $pdo->prepare("UPDATE comments SET hidden = 1 WHERE id = ?");
$stmt->execute([$id]);

send_json(['ok' => true]);
