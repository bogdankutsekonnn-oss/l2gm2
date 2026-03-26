<?php
/**
 * Трекинг кликов по серверам
 *
 * GET /api/out.php?url=https://... — редирект + запись клика
 * GET /api/out.php?all_stats=1    — статистика по всем серверам (admin)
 */

require_once __DIR__ . '/config.php';

// === Админ: статистика ===
if (isset($_GET['all_stats'])) {
    requireAdmin();
    $pdo = getDB();
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

if (isset($_GET['stats']) && isset($_GET['id'])) {
    requireAdmin();
    $pdo = getDB();
    $serverId = (int)$_GET['id'];
    $stmt = $pdo->prepare('
        SELECT server_id, COUNT(*) as total_clicks,
               COUNT(DISTINCT ip) as unique_clicks,
               MAX(clicked_at) as last_click
        FROM clicks WHERE server_id = ?
    ');
    $stmt->execute([$serverId]);
    jsonResponse($stmt->fetch());
}

// === Основной режим: редирект ===

$targetUrl = isset($_GET['url']) ? trim($_GET['url']) : '';

if (!$targetUrl || !filter_var($targetUrl, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo 'Invalid url';
    exit;
}

// Пытаемся записать клик, но если БД недоступна — всё равно редиректим
try {
    $pdo = getDB();
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 512);
    $referer = substr($_SERVER['HTTP_REFERER'] ?? '', 0, 512);

    // Ищем сервер по URL
    $urlNormalized = rtrim($targetUrl, '/');
    $stmt = $pdo->prepare('SELECT id, name FROM servers WHERE TRIM(TRAILING "/" FROM url) = ? LIMIT 1');
    $stmt->execute([$urlNormalized]);
    $server = $stmt->fetch();

    if ($server) {
        $stmt = $pdo->prepare('INSERT INTO clicks (server_id, ip, user_agent, referer) VALUES (?, ?, ?, ?)');
        $stmt->execute([$server['id'], $ip, $userAgent, $referer]);
    }
} catch (Exception $e) {
    // БД недоступна — не блокируем редирект
}

// Редирект
$separator = (strpos($targetUrl, '?') !== false) ? '&' : '?';
$campaign = isset($server) && $server ? urlencode($server['name']) : 'unknown';
$redirectUrl = $targetUrl . $separator . 'utm_source=l2gm&utm_medium=listing&utm_campaign=' . $campaign;

header('Location: ' . $redirectUrl, true, 302);
exit;
