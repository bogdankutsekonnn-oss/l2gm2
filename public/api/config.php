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
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';
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
