<?php
/**
 * Трекинг кликов по серверам (legacy-редирект + статистика для админки).
 *
 * GET /api/out.php?url=https://... — редирект + запись клика.
 *     Новые страницы ссылаются на сервер напрямую и шлют клик в click.php
 *     через sendBeacon; этот режим остаётся для старых закэшированных HTML.
 *
 * GET /api/out.php?all_stats=1     — статистика по всем серверам (admin).
 *     Агрегация по server_key, поэтому в неё попадают и скрейпленные
 *     сервера, которых нет в админ-базе.
 */

require_once __DIR__ . '/config.php';

// Нормализация URL — тот же формат, что в utils/serverTracking.js
// и scripts/sync-from-db.js.
function normalizeServerUrl($url) {
    $u = strtolower(trim((string)$url));
    $u = preg_replace('~^https?://~', '', $u);
    $u = preg_replace('~^www\.~', '', $u);
    return rtrim($u, '/');
}

function serverKeyFromRow($row) {
    $rateOrCat = $row['category'] ?? $row['rate'] ?? 'null';
    return normalizeServerUrl($row['url']) . '|' . $row['chronicle'] . '|' . $rateOrCat;
}

// === Админ: статистика ===
if (isset($_GET['all_stats'])) {
    requireAdmin();
    $pdo = getDB();
    $stmt = $pdo->query('
        SELECT c.server_key,
               MAX(c.server_name) AS name,
               MAX(c.server_id)   AS server_id,
               COUNT(*) AS total_clicks,
               COUNT(DISTINCT c.ip) AS unique_clicks,
               MAX(c.clicked_at) AS last_click
        FROM clicks c
        WHERE c.server_key IS NOT NULL AND c.server_key <> ""
        GROUP BY c.server_key
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

// === Legacy-режим: редирект ===

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
    $stmt = $pdo->prepare('SELECT id, name, url, chronicle, rate, category FROM servers WHERE TRIM(TRAILING "/" FROM url) = ? LIMIT 1');
    $stmt->execute([$urlNormalized]);
    $server = $stmt->fetch();

    if ($server) {
        $stmt = $pdo->prepare('INSERT INTO clicks (server_id, server_key, server_name, ip, user_agent, referer) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$server['id'], serverKeyFromRow($server), $server['name'], $ip, $userAgent, $referer]);
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
