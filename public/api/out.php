<?php
/**
 * Трекинг кликов по серверам
 *
 * GET /api/out?url=https://... — редирект + запись клика
 * GET /api/out?all_stats=1    — статистика по всем серверам (admin)
 * GET /api/out?id=123&stats=1 — статистика по одному серверу (admin)
 */

require_once __DIR__ . '/config.php';

$pdo = getDB();

// Общая статистика по всем серверам (для админки)
if (isset($_GET['all_stats'])) {
    requireAdmin();

    $stmt = $pdo->query('
        SELECT s.id, s.name, s.url, s.chronicle, s.rate, s.card_type, s.start_date,
               COUNT(c.id) as total_clicks,
               COUNT(DISTINCT c.ip) as unique_clicks,
               MAX(c.clicked_at) as last_click
        FROM servers s
        LEFT JOIN clicks c ON c.server_id = s.id
        WHERE s.status = "approved"
        GROUP BY s.id
        ORDER BY total_clicks DESC
    ');
    jsonResponse($stmt->fetchAll());
}

// Статистика по одному серверу (для админки)
if (isset($_GET['stats']) && isset($_GET['id'])) {
    requireAdmin();
    $serverId = (int)$_GET['id'];

    $stmt = $pdo->prepare('
        SELECT server_id, COUNT(*) as total_clicks,
               COUNT(DISTINCT ip) as unique_clicks,
               MAX(clicked_at) as last_click
        FROM clicks
        WHERE server_id = ?
    ');
    $stmt->execute([$serverId]);
    jsonResponse($stmt->fetch());
}

// === Основной режим: редирект с трекингом ===

$targetUrl = isset($_GET['url']) ? trim($_GET['url']) : '';

if (!$targetUrl || !filter_var($targetUrl, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid url']);
    exit;
}

// Ищем сервер в БД по URL для записи клика
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';

// Нормализуем URL для поиска (убираем trailing slash)
$urlNormalized = rtrim($targetUrl, '/');
$stmt = $pdo->prepare('
    SELECT id, name FROM servers
    WHERE TRIM(TRAILING "/" FROM url) = ?
    LIMIT 1
');
$stmt->execute([$urlNormalized]);
$server = $stmt->fetch();

if ($server) {
    // Сервер найден в БД — записываем клик с привязкой
    $stmt = $pdo->prepare('
        INSERT INTO clicks (server_id, ip, user_agent, referer)
        VALUES (?, ?, ?, ?)
    ');
    $stmt->execute([$server['id'], $ip, $userAgent, $referer]);
} else {
    // Сервер не в БД (из JSON) — записываем клик без привязки (server_id = 0)
    $stmt = $pdo->prepare('
        INSERT INTO clicks (server_id, ip, user_agent, referer)
        VALUES (0, ?, ?, ?)
    ');
    $stmt->execute([$ip, $userAgent, $referer]);
}

// Редирект с UTM-метками
$serverName = $server ? $server['name'] : 'unknown';
$separator = (strpos($targetUrl, '?') !== false) ? '&' : '?';
$redirectUrl = $targetUrl . $separator . 'utm_source=l2gm&utm_medium=listing&utm_campaign=' . urlencode($serverName);

header('Location: ' . $redirectUrl, true, 302);
exit;
