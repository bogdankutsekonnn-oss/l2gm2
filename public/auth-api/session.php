<?php
// Обмен одноразового handoff-кода (из OAuth-редиректа) на bearer-токен.
// POST /auth-api/session.php?action=exchange  body: {code}
require __DIR__ . '/lib.php';

$cfg = auth_config();
auth_cors($cfg);

$action = $_GET['action'] ?? '';
if ($action !== 'exchange') {
    send_json(['error' => 'unknown_action'], 400);
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}

$body = read_json_body();
$code = (string) ($body['code'] ?? '');
if ($code === '') {
    send_json(['error' => 'bad_request'], 400);
}

$pdo = auth_db($cfg);

// Достаём и сразу удаляем код (одноразовый)
$stmt = $pdo->prepare('SELECT token FROM auth_handoff WHERE code = ? AND expires_at > NOW() LIMIT 1');
$stmt->execute([$code]);
$row = $stmt->fetch();
$pdo->prepare('DELETE FROM auth_handoff WHERE code = ?')->execute([$code]);

if (!$row) {
    send_json(['error' => 'code_expired'], 400);
}

$token = $row['token'];
$u = $pdo->prepare(
    'SELECT u.* FROM user_sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1'
);
$u->execute([$token]);
$user = $u->fetch();
if (!$user) {
    send_json(['error' => 'session_invalid'], 400);
}

send_json([
    'token' => $token,
    'user'  => public_user($pdo, $user),
]);
