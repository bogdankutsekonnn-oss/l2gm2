<?php
require_once __DIR__ . '/config.php';

// Все запросы к admin.php требуют авторизации
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'approve':
        approveServer();
        break;
    case 'reject':
        rejectServer();
        break;
    case 'update':
        updateServer();
        break;
    case 'delete':
        deleteServer();
        break;
    default:
        jsonResponse(['error' => 'Unknown action. Use: approve, reject, update, delete'], 400);
}

// POST /api/admin.php?action=approve&id=123
function approveServer() {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'Missing server ID'], 400);

    $db = getDB();
    $stmt = $db->prepare('UPDATE servers SET status = "approved" WHERE id = :id');
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['error' => 'Server not found'], 404);
    }

    jsonResponse(['success' => true, 'message' => "Server #$id approved"]);
}

// POST /api/admin.php?action=reject&id=123
function rejectServer() {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'Missing server ID'], 400);

    $db = getDB();
    $stmt = $db->prepare('UPDATE servers SET status = "rejected" WHERE id = :id');
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['error' => 'Server not found'], 404);
    }

    jsonResponse(['success' => true, 'message' => "Server #$id rejected"]);
}

// PUT /api/admin.php?action=update&id=123
function updateServer() {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'Missing server ID'], 400);

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) jsonResponse(['error' => 'Invalid JSON'], 400);

    $db = getDB();

    // Допустимые поля для обновления
    $allowed = [
        'name', 'url', 'chronicle', 'rate', 'category',
        'start_date', 'card_type', 'icons', 'server_types',
        'email', 'contacts', 'status', 'expires_at', 'description',
    ];

    $sets = [];
    $params = [':id' => $id];

    foreach ($input as $key => $value) {
        // Конвертируем camelCase в snake_case
        $snakeKey = strtolower(preg_replace('/[A-Z]/', '_$0', $key));

        if (!in_array($snakeKey, $allowed)) continue;

        // JSON-поля
        if (in_array($snakeKey, ['icons', 'server_types']) && is_array($value)) {
            $value = json_encode($value);
        }

        $sets[] = "`$snakeKey` = :$snakeKey";
        $params[":$snakeKey"] = $value;
    }

    if (empty($sets)) {
        jsonResponse(['error' => 'No valid fields to update'], 400);
    }

    $sql = 'UPDATE servers SET ' . implode(', ', $sets) . ' WHERE id = :id';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['error' => 'Server not found or no changes'], 404);
    }

    jsonResponse(['success' => true, 'message' => "Server #$id updated"]);
}

// DELETE /api/admin.php?action=delete&id=123
function deleteServer() {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'Missing server ID'], 400);

    $db = getDB();
    $stmt = $db->prepare('DELETE FROM servers WHERE id = :id');
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['error' => 'Server not found'], 404);
    }

    jsonResponse(['success' => true, 'message' => "Server #$id deleted"]);
}
