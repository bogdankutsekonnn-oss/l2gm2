<?php
/**
 * Трекинг кликов по серверам
 *
 * GET /api/out?id=123 — редирект на сайт сервера + запись клика
 * GET /api/out?id=123&stats=1 — получить количество кликов (admin)
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

$serverId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($serverId <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid server id']);
    exit;
}

// Статистика по одному серверу (для админки)
if (isset($_GET['stats'])) {
    requireAdmin();

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

// Получаем URL сервера
$stmt = $pdo->prepare('SELECT url, name FROM servers WHERE id = ? AND status = "approved"');
$stmt->execute([$serverId]);
$server = $stmt->fetch();

if (!$server) {
    http_response_code(404);
    echo json_encode(['error' => 'Server not found']);
    exit;
}

// Записываем клик
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';

$stmt = $pdo->prepare('
    INSERT INTO clicks (server_id, ip, user_agent, referer)
    VALUES (?, ?, ?, ?)
');
$stmt->execute([$serverId, $ip, $userAgent, $referer]);

// Редирект с UTM-метками
$targetUrl = $server['url'];
$separator = (strpos($targetUrl, '?') !== false) ? '&' : '?';
$targetUrl .= $separator . 'utm_source=l2gm&utm_medium=listing&utm_campaign=' . urlencode($server['name']);

header('Location: ' . $targetUrl, true, 302);
exit;
