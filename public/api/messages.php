<?php
// GET /api/messages.php?since=<id> — сообщения из формы «О нас».
//
// Хостинг не достаёт до api.telegram.org, поэтому contact.php складывает
// письма в базу, а забирает их отсюда scripts/notify-pending.js из GitHub
// Actions — он и отправляет в чат. Курсор since держится на его стороне,
// в .github/notified-applications.json.
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

requireAdmin();

$since = isset($_GET['since']) ? max(0, (int)$_GET['since']) : 0;

$db = getDB();
$stmt = $db->prepare(
    'SELECT id, name, reply, message, created_at
     FROM contact_messages
     WHERE id > :since
     ORDER BY id ASC
     LIMIT 100'
);
$stmt->execute([':since' => $since]);

jsonResponse(array_map(function ($row) {
    return [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'reply' => $row['reply'],
        'message' => $row['message'],
        'createdAt' => $row['created_at'],
    ];
}, $stmt->fetchAll()));
