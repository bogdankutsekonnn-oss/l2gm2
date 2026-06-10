<?php
/**
 * Приём кликов по серверам (navigator.sendBeacon с фронта).
 *
 * POST /api/click.php  body: {"key": "url|chronicle|rate", "name": "...", "url": "https://..."}
 *
 * Переход на сервер идёт напрямую (без редиректа), клик прилетает в фоне —
 * поэтому скорость ответа здесь ни на что не влияет. out.php оставлен для
 * старых закэшированных страниц.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'POST required'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$key  = isset($input['key'])  ? substr(trim($input['key']), 0, 300) : '';
$name = isset($input['name']) ? substr(trim(strip_tags($input['name'])), 0, 255) : '';
$url  = isset($input['url'])  ? trim($input['url']) : '';

if ($key === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
    jsonResponse(['error' => 'Invalid payload'], 400);
}

try {
    $pdo = getDB();
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 512);
    $referer = substr($_SERVER['HTTP_REFERER'] ?? '', 0, 512);

    // Антидубль: повторный клик с того же IP по тому же серверу в течение
    // 10 секунд не пишем (двойные клики, спам по кнопке).
    $stmt = $pdo->prepare(
        'SELECT 1 FROM clicks
         WHERE server_key = ? AND ip = ? AND clicked_at > DATE_SUB(NOW(), INTERVAL 10 SECOND)
         LIMIT 1'
    );
    $stmt->execute([$key, $ip]);
    if ($stmt->fetch()) {
        http_response_code(204);
        exit;
    }

    // Если сервер есть в админ-базе — привязываем клик и к нему
    $stmt = $pdo->prepare('SELECT id FROM servers WHERE TRIM(TRAILING "/" FROM url) = ? LIMIT 1');
    $stmt->execute([rtrim($url, '/')]);
    $server = $stmt->fetch();

    $stmt = $pdo->prepare(
        'INSERT INTO clicks (server_id, server_key, server_name, ip, user_agent, referer)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$server ? $server['id'] : null, $key, $name, $ip, $userAgent, $referer]);

    // Лёгкая ротация: изредка подчищаем клики старше года, чтобы таблица
    // не росла бесконечно (агрегированная статистика старше года не нужна).
    if (mt_rand(1, 300) === 1) {
        $pdo->exec('DELETE FROM clicks WHERE clicked_at < DATE_SUB(NOW(), INTERVAL 1 YEAR) LIMIT 5000');
    }
} catch (Exception $e) {
    // БД недоступна — молча глотаем, клик не критичен
}

http_response_code(204);
exit;
