<?php
// PDO-подключение к MySQL (singleton).
function comments_db(array $cfg): PDO
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
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'db_connect_failed'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
    return $pdo;
}
