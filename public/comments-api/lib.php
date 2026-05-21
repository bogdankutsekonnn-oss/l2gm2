<?php
// Общие хелперы для эндпоинтов комментариев.

function load_config(): array
{
    $path = __DIR__ . '/config.php';
    if (!file_exists($path)) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'config_missing'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    return require $path;
}

function cors_and_json(array $cfg): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . $cfg['allow_origin']);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('X-Content-Type-Options: nosniff');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function send_json($data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function clean_slug($value): string
{
    return substr(preg_replace('/[^a-z0-9\-]/', '', (string) $value), 0, 255);
}

// Проверка подписи Telegram Login Widget.
// https://core.telegram.org/widgets/login#checking-authorization
function verify_telegram_auth(array $authData, string $botToken): bool
{
    if (empty($authData['hash']) || empty($authData['id'])) {
        return false;
    }
    $hash = (string) $authData['hash'];

    $fields = $authData;
    unset($fields['hash']);
    ksort($fields);

    $pairs = [];
    foreach ($fields as $k => $v) {
        $pairs[] = $k . '=' . $v;
    }
    $dataCheckString = implode("\n", $pairs);

    $secretKey = hash('sha256', $botToken, true);
    $calc = hash_hmac('sha256', $dataCheckString, $secretKey);

    if (!hash_equals($calc, $hash)) {
        return false;
    }
    // Логин не старше 1 суток
    if (!empty($authData['auth_date']) && (time() - (int) $authData['auth_date']) > 86400) {
        return false;
    }
    return true;
}

// HTTP GET к Telegram Bot API (cURL с fallback на file_get_contents).
function tg_api_get(string $url): ?string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 8);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        $resp = curl_exec($ch);
        curl_close($ch);
        return $resp === false ? null : $resp;
    }
    $resp = @file_get_contents($url);
    return $resp === false ? null : $resp;
}

// Проверка, подписан ли пользователь на канал.
function is_channel_member(string $botToken, string $channel, int $userId): bool
{
    $url = "https://api.telegram.org/bot{$botToken}/getChatMember"
        . "?chat_id=" . urlencode($channel)
        . "&user_id=" . $userId;

    $resp = tg_api_get($url);
    if ($resp === null) {
        return false;
    }
    $data = json_decode($resp, true);
    if (empty($data['ok'])) {
        return false;
    }
    $status = $data['result']['status'] ?? '';
    return in_array($status, ['creator', 'administrator', 'member'], true);
}
