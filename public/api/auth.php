<?php
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':   loginAction(); break;
    case 'logout':  logoutAction(); break;
    case 'me':      meAction(); break;
    default:
        jsonResponse(['error' => 'Unknown action. Use: login, logout, me'], 400);
}

// POST /api/auth.php?action=login  body: {username, password}
function loginAction() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'POST required'], 405);
    }
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $username = trim($input['username'] ?? '');
    $password = (string)($input['password'] ?? '');

    if ($username === '' || $password === '') {
        jsonResponse(['error' => 'username and password required'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT id, username, password_hash FROM admin_users WHERE username = :u LIMIT 1');
    $stmt->execute([':u' => $username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        // намеренная задержка от брутфорса
        usleep(300000);
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }

    // 30 дней
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', time() + 30 * 24 * 3600);

    $db->prepare(
        'INSERT INTO admin_sessions (user_id, token, expires_at) VALUES (:uid, :t, :exp)'
    )->execute([':uid' => $user['id'], ':t' => $token, ':exp' => $expires]);

    jsonResponse([
        'success'    => true,
        'token'      => $token,
        'expires_at' => $expires,
        'user'       => ['id' => (int)$user['id'], 'username' => $user['username']],
    ]);
}

// POST /api/auth.php?action=logout
function logoutAction() {
    $token = getBearerToken();
    if ($token === '' || $token === ADMIN_TOKEN) {
        jsonResponse(['success' => true]);
    }
    $db = getDB();
    $db->prepare('DELETE FROM admin_sessions WHERE token = :t')->execute([':t' => $token]);
    jsonResponse(['success' => true]);
}

// GET /api/auth.php?action=me
function meAction() {
    $u = requireUser();
    jsonResponse(['user' => $u]);
}
