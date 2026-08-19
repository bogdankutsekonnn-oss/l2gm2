<?php
// Общие хелперы пользовательской авторизации (Google / Яндекс / Email / Telegram).
// Соглашения повторяют public/comments-api/ и public/api/config.php.

// ---------------------------------------------------------------------------
// Конфиг, CORS, JSON, тело запроса
// ---------------------------------------------------------------------------

function auth_config(): array
{
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'config_missing'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    return require $path;
}

// Для JSON-эндпоинтов (email/*, session, me, logout, telegram)
function auth_cors(array $cfg): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . $cfg['allow_origin']);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('X-Content-Type-Options: nosniff');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function send_json($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// ---------------------------------------------------------------------------
// База данных
// ---------------------------------------------------------------------------

function auth_db(array $cfg): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host={$cfg['db_host']};dbname={$cfg['db_name']};charset=utf8mb4";
        try {
            $pdo = new PDO($dsn, $cfg['db_user'], $cfg['db_pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (Throwable $e) {
            send_json(['error' => 'db_connect_failed'], 500);
        }
    }
    return $pdo;
}

// ---------------------------------------------------------------------------
// HTTP к внешним провайдерам (cURL с fallback)
// ---------------------------------------------------------------------------

function http_request(string $method, string $url, ?array $form = null, array $headers = []): array
{
    $method = strtoupper($method);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 12);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($form !== null) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($form));
            }
        }
        if ($headers) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ['status' => $status, 'body' => $body === false ? '' : $body];
    }

    // Fallback без cURL
    $opts = ['http' => ['method' => $method, 'timeout' => 12, 'ignore_errors' => true]];
    if ($headers) {
        $opts['http']['header'] = implode("\r\n", $headers);
    }
    if ($method === 'POST' && $form !== null) {
        $opts['http']['header'] = trim(($opts['http']['header'] ?? '') . "\r\nContent-Type: application/x-www-form-urlencoded");
        $opts['http']['content'] = http_build_query($form);
    }
    $body = @file_get_contents($url, false, stream_context_create($opts));
    $status = 0;
    if (isset($http_response_header[0]) && preg_match('#\s(\d{3})\s#', $http_response_header[0], $m)) {
        $status = (int) $m[1];
    }
    return ['status' => $status, 'body' => $body === false ? '' : $body];
}

function http_get_json(string $url, array $headers = []): ?array
{
    $res = http_request('GET', $url, null, $headers);
    $data = json_decode($res['body'], true);
    return is_array($data) ? $data : null;
}

function http_post_json(string $url, array $form, array $headers = []): ?array
{
    $res = http_request('POST', $url, $form, $headers);
    $data = json_decode($res['body'], true);
    return is_array($data) ? $data : null;
}

// ---------------------------------------------------------------------------
// Сессии и передача токена на фронт
// ---------------------------------------------------------------------------

function create_session(PDO $pdo, int $userId): string
{
    $token = bin2hex(random_bytes(32)); // 64 hex-символа
    $pdo->prepare(
        'INSERT INTO user_sessions (token, user_id, expires_at)
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))'
    )->execute([$token, $userId]);
    $pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([$userId]);
    return $token;
}

// Одноразовый код для OAuth-редиректа (токен не попадает в URL).
function make_handoff(PDO $pdo, string $token): string
{
    $code = bin2hex(random_bytes(24)); // 48 символов
    $pdo->prepare(
        'INSERT INTO auth_handoff (code, token, expires_at)
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 2 MINUTE))'
    )->execute([$code, $token]);
    return $code;
}

// Проверка Bearer-токена → строка users или 401.
function require_user(PDO $pdo): array
{
    $token = get_bearer_token();
    if ($token === '') {
        send_json(['error' => 'unauthorized'], 401);
    }
    $stmt = $pdo->prepare(
        'SELECT u.* FROM user_sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1'
    );
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    if (!$user) {
        send_json(['error' => 'unauthorized'], 401);
    }
    $pdo->prepare('UPDATE user_sessions SET last_used_at = NOW() WHERE token = ?')->execute([$token]);
    return $user;
}

function get_bearer_token(): string
{
    $auth = '';
    if (function_exists('getallheaders')) {
        $h = getallheaders();
        $auth = $h['Authorization'] ?? $h['authorization'] ?? '';
    }
    if (!$auth && !empty($_SERVER['HTTP_AUTHORIZATION'])) $auth = $_SERVER['HTTP_AUTHORIZATION'];
    if (!$auth && !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    return trim(str_replace('Bearer ', '', $auth));
}

// Публичное представление пользователя (для фронта).
function public_user(PDO $pdo, array $user): array
{
    $stmt = $pdo->prepare('SELECT provider FROM user_identities WHERE user_id = ?');
    $stmt->execute([$user['id']]);
    $providers = array_column($stmt->fetchAll(), 'provider');
    return [
        'id'             => (int) $user['id'],
        'display_name'   => $user['display_name'],
        'email'          => $user['email'],
        'email_verified' => (bool) $user['email_verified'],
        'photo_url'      => $user['photo_url'],
        'providers'      => $providers,
    ];
}

// ---------------------------------------------------------------------------
// Поиск / создание пользователя по внешней identity
// ---------------------------------------------------------------------------

/**
 * Находит пользователя по (provider, uid); если нет — по verified email;
 * иначе создаёт нового. Всегда гарантирует наличие identity этого провайдера.
 * Возвращает user_id.
 */
function find_or_create_user(
    PDO $pdo,
    string $provider,
    string $uid,
    ?string $email,
    ?string $name,
    ?string $photo,
    bool $emailVerified
): int {
    $email = $email ? mb_strtolower(trim($email)) : null;

    // 1) По существующей identity
    $stmt = $pdo->prepare('SELECT user_id FROM user_identities WHERE provider = ? AND provider_uid = ? LIMIT 1');
    $stmt->execute([$provider, $uid]);
    $found = $stmt->fetch();
    if ($found) {
        $userId = (int) $found['user_id'];
        fill_missing_profile($pdo, $userId, $name, $photo, $email, $emailVerified);
        return $userId;
    }

    // 2) По verified email — привязываем новый провайдер к существующему аккаунту
    if ($email && $emailVerified) {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $u = $stmt->fetch();
        if ($u) {
            $userId = (int) $u['id'];
            link_identity($pdo, $userId, $provider, $uid);
            fill_missing_profile($pdo, $userId, $name, $photo, $email, $emailVerified);
            return $userId;
        }
    }

    // 3) Новый пользователь
    $pdo->prepare(
        'INSERT INTO users (display_name, email, email_verified, photo_url)
         VALUES (?, ?, ?, ?)'
    )->execute([
        $name ?: null,
        ($email && $emailVerified) ? $email : null,
        ($email && $emailVerified) ? 1 : 0,
        $photo ?: null,
    ]);
    $userId = (int) $pdo->lastInsertId();
    link_identity($pdo, $userId, $provider, $uid);
    return $userId;
}

function link_identity(PDO $pdo, int $userId, string $provider, string $uid): void
{
    $pdo->prepare(
        'INSERT IGNORE INTO user_identities (user_id, provider, provider_uid) VALUES (?, ?, ?)'
    )->execute([$userId, $provider, $uid]);
}

// Дозаполняет пустые поля профиля (не перезатирая уже заданные).
function fill_missing_profile(PDO $pdo, int $userId, ?string $name, ?string $photo, ?string $email, bool $emailVerified): void
{
    $sets = [];
    $args = [];
    if ($name)  { $sets[] = 'display_name = COALESCE(display_name, ?)'; $args[] = $name; }
    if ($photo) { $sets[] = 'photo_url = COALESCE(photo_url, ?)'; $args[] = $photo; }
    if ($email && $emailVerified) {
        // проставляем email только если он ещё не занят другим аккаунтом
        $chk = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1');
        $chk->execute([$email, $userId]);
        if (!$chk->fetch()) {
            $sets[] = 'email = COALESCE(email, ?)';
            $args[] = $email;
            $sets[] = 'email_verified = GREATEST(email_verified, 1)';
        }
    }
    if (!$sets) return;
    $args[] = $userId;
    $pdo->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($args);
}

// ---------------------------------------------------------------------------
// OAuth CSRF-state (httpOnly cookie, без БД)
// ---------------------------------------------------------------------------

function oauth_set_state(string $provider): string
{
    $state = bin2hex(random_bytes(16));
    setcookie('oauth_state_' . $provider, $state, [
        'expires'  => time() + 600,
        'path'     => '/auth-api/',
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    return $state;
}

function oauth_check_state(string $provider): bool
{
    $got = $_GET['state'] ?? '';
    $exp = $_COOKIE['oauth_state_' . $provider] ?? '';
    // гасим cookie
    setcookie('oauth_state_' . $provider, '', ['expires' => time() - 3600, 'path' => '/auth-api/']);
    return $got !== '' && $exp !== '' && hash_equals($exp, $got);
}

// Редирект на фронт с одноразовым кодом (после успешного OAuth/verify).
function redirect_to_frontend(array $cfg, string $code): void
{
    header('Location: ' . rtrim($cfg['redirect_base'], '/') . '/auth/callback/?code=' . urlencode($code));
    exit;
}

function redirect_with_error(array $cfg, string $err): void
{
    header('Location: ' . rtrim($cfg['redirect_base'], '/') . '/auth/callback/?error=' . urlencode($err));
    exit;
}

// ---------------------------------------------------------------------------
// Рейт-лимит по IP (файловый, как в public/api/servers.php)
// ---------------------------------------------------------------------------

function rate_limit(string $bucket, int $max, int $windowSec): bool
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = sys_get_temp_dir() . '/l2gm_auth_' . $bucket . '_' . md5($ip);
    $now = time();
    $times = [];
    if (is_file($file)) {
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        $times = array_values(array_filter(array_map('intval', $lines), fn($t) => $t > $now - $windowSec));
    }
    if (count($times) >= $max) {
        return false;
    }
    $times[] = $now;
    @file_put_contents($file, implode("\n", $times));
    return true;
}

// ---------------------------------------------------------------------------
// Отправка письма (SMTP через SSL-сокет; fallback на mail())
// ---------------------------------------------------------------------------

function send_mail(array $cfg, string $to, string $subject, string $html): bool
{
    $from = $cfg['smtp_from'] ?? 'no-reply@l2gm.com';
    $fromName = $cfg['smtp_from_name'] ?? 'L2GM';
    $subjectEnc = '=?UTF-8?B?' . base64_encode($subject) . '?=';

    // Нет SMTP-хоста → пробуем mail()
    if (empty($cfg['smtp_host'])) {
        $headers = "MIME-Version: 1.0\r\n"
            . "Content-Type: text/html; charset=UTF-8\r\n"
            . "From: {$fromName} <{$from}>\r\n";
        return @mail($to, $subjectEnc, $html, $headers);
    }

    $host = $cfg['smtp_host'];
    $port = (int) ($cfg['smtp_port'] ?? 465);
    $user = $cfg['smtp_user'] ?? '';
    $pass = $cfg['smtp_pass'] ?? '';
    $transport = $port === 465 ? "ssl://{$host}" : $host;

    $fp = @fsockopen($transport, $port, $errno, $errstr, 12);
    if (!$fp) return false;

    $read = function () use ($fp) {
        $data = '';
        while ($line = fgets($fp, 512)) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        return $data;
    };
    $cmd = function (string $c) use ($fp, $read) {
        fwrite($fp, $c . "\r\n");
        return $read();
    };

    $read(); // приветствие
    $cmd("EHLO l2gm.com");
    // STARTTLS для 587
    if ($port !== 465) {
        $cmd("STARTTLS");
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($fp);
            return false;
        }
        $cmd("EHLO l2gm.com");
    }
    if ($user !== '') {
        $cmd("AUTH LOGIN");
        $cmd(base64_encode($user));
        $resp = $cmd(base64_encode($pass));
        if (strpos($resp, '235') === false) { fclose($fp); return false; }
    }
    $cmd("MAIL FROM:<{$from}>");
    $cmd("RCPT TO:<{$to}>");
    $data = $cmd("DATA");
    if (strpos($data, '354') === false) { fclose($fp); return false; }

    $message = "From: {$fromName} <{$from}>\r\n"
        . "To: <{$to}>\r\n"
        . "Subject: {$subjectEnc}\r\n"
        . "MIME-Version: 1.0\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "\r\n"
        . $html . "\r\n.";
    $sent = $cmd($message);
    $cmd("QUIT");
    fclose($fp);
    return strpos($sent, '250') !== false;
}

// ---------------------------------------------------------------------------
// Telegram Login Widget (перенос из comments-api/lib.php)
// ---------------------------------------------------------------------------

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
    if (!empty($authData['auth_date']) && (time() - (int) $authData['auth_date']) > 86400) {
        return false;
    }
    return true;
}
