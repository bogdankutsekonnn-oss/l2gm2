<?php
// Конфигурация базы данных
// Замени значения на свои данные из панели Timeweb
define('DB_HOST', 'localhost');
define('DB_NAME', 'damonlaptev_servers');
define('DB_USER', 'damonlaptev_servers');
define('DB_PASS', 'aqx45e9n3a');

// Секретный ключ для админки
define('ADMIN_TOKEN', 'L2gm_Adm1n_2026_xKp9mQ');

// CORS — разрешаем запросы с нашего сайта
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://l2gm.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Подключение к базе
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed']);
            exit;
        }
    }
    return $pdo;
}

// Проверка админ-токена
function requireAdmin() {
    $auth = '';

    // Способ 1: getallheaders
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    // Способ 2: $_SERVER (Apache RewriteRule)
    if (!$auth && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
    }

    // Способ 3: REDIRECT_ prefix (CGI/FastCGI)
    if (!$auth && !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    // Способ 4: через GET параметр (fallback)
    if (!$auth && !empty($_GET['token'])) {
        $auth = 'Bearer ' . $_GET['token'];
    }

    $token = str_replace('Bearer ', '', $auth);

    if ($token !== ADMIN_TOKEN) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

// Безопасный JSON ответ
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Извлечь Bearer-токен из заголовка / GET
function getBearerToken() {
    $auth = '';
    if (function_exists('getallheaders')) {
        $h = getallheaders();
        $auth = $h['Authorization'] ?? $h['authorization'] ?? '';
    }
    if (!$auth && !empty($_SERVER['HTTP_AUTHORIZATION'])) $auth = $_SERVER['HTTP_AUTHORIZATION'];
    if (!$auth && !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    if (!$auth && !empty($_GET['token'])) $auth = 'Bearer ' . $_GET['token'];
    return trim(str_replace('Bearer ', '', $auth));
}

/**
 * Проверка пользовательской сессии (логин/пароль → токен).
 * Возвращает массив ['user_id'=>..,'username'=>..] или 401.
 * Также принимает мастер-токен ADMIN_TOKEN (user_id=null).
 */
function requireUser() {
    $token = getBearerToken();
    if ($token === '') {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    // Мастер-токен — без user_id
    if ($token === ADMIN_TOKEN) {
        return ['user_id' => null, 'username' => 'master'];
    }

    $db = getDB();
    $stmt = $db->prepare(
        'SELECT s.user_id, u.username
         FROM admin_sessions s
         JOIN admin_users u ON u.id = s.user_id
         WHERE s.token = :t AND s.expires_at > NOW()
         LIMIT 1'
    );
    $stmt->execute([':t' => $token]);
    $row = $stmt->fetch();

    if (!$row) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    // Обновляем last_used_at (без блокировки)
    $db->prepare('UPDATE admin_sessions SET last_used_at = NOW() WHERE token = :t')
       ->execute([':t' => $token]);

    return ['user_id' => (int)$row['user_id'], 'username' => $row['username']];
}
