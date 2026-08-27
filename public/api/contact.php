<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonResponse(['error' => 'Invalid JSON'], 400);
}

$source = $input['source'] ?? '';

if ($source === 'about') {
    handleContactForm($input);
} else {
    jsonResponse(['error' => 'Unknown source'], 400);
}

// Рейт-лимит по IP — тот же приём, что для заявок в servers.php. Раньше форма
// писала только в телегу и лимит был не нужен, теперь пишет в базу.
function throttleByIp($bucket, $limit, $window) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = sys_get_temp_dir() . '/l2gm_' . $bucket . '_' . md5($ip);
    $now = time();
    $times = [];
    if (is_file($file)) {
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        $times = array_values(array_filter(array_map('intval', $lines), function ($t) use ($now, $window) {
            return $t > $now - $window;
        }));
    }
    if (count($times) >= $limit) {
        return false;
    }
    $times[] = $now;
    @file_put_contents($file, implode("\n", $times));
    return true;
}

function handleContactForm($input) {
    $name = trim(strip_tags($input['name'] ?? ''));
    $reply = trim(strip_tags($input['reply'] ?? ''));
    $message = trim(strip_tags($input['message'] ?? ''));

    if ($name === '' || $message === '') {
        jsonResponse(['error' => 'name and message are required'], 400);
    }

    if (!throttleByIp('contact', 5, 3600)) {
        jsonResponse(['error' => 'Слишком много сообщений. Попробуйте через час.'], 429);
    }

    // Раньше сообщение уходило прямо в телегу и нигде не сохранялось. Хостинг
    // до api.telegram.org не достаёт (исходящие на 443 виснут по таймауту),
    // так что каждое письмо просто пропадало. Теперь кладём в базу, оттуда
    // его заберёт и отправит scripts/notify-pending.js с раннера GitHub.
    $db = getDB();
    $stmt = $db->prepare(
        'INSERT INTO contact_messages (name, reply, message, ip)
         VALUES (:name, :reply, :message, :ip)'
    );
    $stmt->execute([
        ':name' => mb_substr($name, 0, 255),
        ':reply' => $reply !== '' ? mb_substr($reply, 0, 255) : null,
        ':message' => mb_substr($message, 0, 4000),
        ':ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    ]);

    jsonResponse(['ok' => true]);
}

