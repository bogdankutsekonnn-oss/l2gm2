<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        handlePost();
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

// GET /api/servers.php — получить серверы
// Параметры: ?status=approved (по умолчанию только approved)
//            ?all=1 (для админки — все статусы, требует токен)
function handleGet() {
    $db = getDB();

    // Админ хочет все серверы
    if (isset($_GET['all']) && $_GET['all'] === '1') {
        requireAdmin();
        $stmt = $db->query('SELECT * FROM servers ORDER BY created_at DESC');
        $servers = $stmt->fetchAll();
        jsonResponse(formatServers($servers));
    }

    // Публичный доступ — только approved
    $stmt = $db->query(
        'SELECT * FROM servers WHERE status = "approved" ORDER BY
            FIELD(card_type, "premium", "vip-plus", "vip", "top", "basic"),
            start_date ASC'
    );
    $servers = $stmt->fetchAll();
    jsonResponse(formatServers($servers));
}

// POST /api/servers.php — новая заявка
function handlePost() {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        jsonResponse(['error' => 'Invalid JSON'], 400);
    }

    // Валидация обязательных полей
    $required = ['name', 'url', 'chronicle', 'startDate'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            jsonResponse(['error' => "Field '$field' is required"], 400);
        }
    }

    // Санитизация
    $name = trim(strip_tags($input['name']));
    $url = filter_var(trim($input['url']), FILTER_SANITIZE_URL);
    $chronicle = trim(strip_tags($input['chronicle']));
    $rate = isset($input['rate']) && is_numeric($input['rate']) ? (int)$input['rate'] : null;
    $category = isset($input['category']) ? trim(strip_tags($input['category'])) : null;
    $startDate = $input['startDate'];
    $cardType = in_array($input['cardType'] ?? 'basic', ['basic', 'top', 'vip', 'vip-plus', 'premium'])
        ? $input['cardType']
        : 'basic';
    $icons = isset($input['icons']) && is_array($input['icons'])
        ? json_encode($input['icons'])
        : '[]';
    $serverTypes = isset($input['serverTypes']) && is_array($input['serverTypes'])
        ? json_encode($input['serverTypes'])
        : '[]';
    $email = isset($input['email']) ? filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL) : null;
    $contacts = isset($input['contacts']) ? trim(strip_tags($input['contacts'])) : null;
    $expiresAt = $input['expiresAt'] ?? null;

    // Валидация URL
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        jsonResponse(['error' => 'Invalid URL'], 400);
    }

    // Валидация даты
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $startDate)) {
        jsonResponse(['error' => 'Invalid date format'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare(
        'INSERT INTO servers (name, url, chronicle, rate, category, start_date, card_type, icons, server_types, email, contacts, status, expires_at)
         VALUES (:name, :url, :chronicle, :rate, :category, :startDate, :cardType, :icons, :serverTypes, :email, :contacts, "pending", :expiresAt)'
    );

    $stmt->execute([
        ':name' => $name,
        ':url' => $url,
        ':chronicle' => $chronicle,
        ':rate' => $rate,
        ':category' => $category,
        ':startDate' => $startDate,
        ':cardType' => $cardType,
        ':icons' => $icons,
        ':serverTypes' => $serverTypes,
        ':email' => $email,
        ':contacts' => $contacts,
        ':expiresAt' => $expiresAt,
    ]);

    $id = $db->lastInsertId();
    jsonResponse(['success' => true, 'id' => (int)$id], 201);
}

// Форматирование серверов в формат, совместимый с фронтом
function formatServers($rows) {
    return array_map(function ($row) {
        return [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'url' => $row['url'],
            'chronicle' => $row['chronicle'],
            'rate' => $row['rate'] !== null ? (int)$row['rate'] : null,
            'category' => $row['category'],
            'startDate' => $row['start_date'],
            'cardType' => $row['card_type'],
            'icons' => json_decode($row['icons'] ?? '[]', true),
            'serverTypes' => json_decode($row['server_types'] ?? '[]', true),
            'avatarUrl' => $row['avatar_url'],
            'description' => $row['description'],
            'email' => $row['email'],
            'contacts' => $row['contacts'],
            'status' => $row['status'],
            'createdAt' => $row['created_at'],
            'expiresAt' => $row['expires_at'],
        ];
    }, $rows);
}
