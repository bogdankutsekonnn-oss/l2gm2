<?php
/**
 * CLI-утилита для создания админ-пользователя.
 *
 * Использование (на сервере, через SSH или панель Timeweb):
 *   php add-user.php <username> <password>
 *
 * Также работает по HTTP, но только с мастер-токеном:
 *   curl -X POST 'https://l2gm.com/api/add-user.php?token=ADMIN_TOKEN' \
 *        -H 'Content-Type: application/json' \
 *        -d '{"username":"vasya","password":"secret123"}'
 */

if (php_sapi_name() === 'cli') {
    require_once __DIR__ . '/config.php';

    $username = $argv[1] ?? '';
    $password = $argv[2] ?? '';
    if ($username === '' || $password === '') {
        fwrite(STDERR, "Usage: php add-user.php <username> <password>\n");
        exit(1);
    }
    createUser($username, $password, true);
    exit(0);
}

require_once __DIR__ . '/config.php';

// HTTP-режим: только мастер-токен
$token = getBearerToken();
if ($token !== ADMIN_TOKEN) {
    jsonResponse(['error' => 'Master token required'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'POST required'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($input['username'] ?? '');
$password = (string)($input['password'] ?? '');
if ($username === '' || strlen($password) < 6) {
    jsonResponse(['error' => 'username + password (min 6 chars) required'], 400);
}

createUser($username, $password, false);

function createUser($username, $password, $isCli) {
    $db = getDB();
    $hash = password_hash($password, PASSWORD_BCRYPT);
    try {
        $db->prepare('INSERT INTO admin_users (username, password_hash) VALUES (:u, :h)')
           ->execute([':u' => $username, ':h' => $hash]);
        $id = (int)$db->lastInsertId();
        if ($isCli) {
            echo "Created user #$id ($username)\n";
        } else {
            jsonResponse(['success' => true, 'id' => $id, 'username' => $username]);
        }
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            // уже существует — обновим пароль
            $db->prepare('UPDATE admin_users SET password_hash = :h WHERE username = :u')
               ->execute([':u' => $username, ':h' => $hash]);
            if ($isCli) {
                echo "Updated password for $username\n";
            } else {
                jsonResponse(['success' => true, 'updated' => true, 'username' => $username]);
            }
        } else {
            if ($isCli) {
                fwrite(STDERR, "Error: " . $e->getMessage() . "\n");
                exit(1);
            }
            jsonResponse(['error' => 'DB error'], 500);
        }
    }
}
