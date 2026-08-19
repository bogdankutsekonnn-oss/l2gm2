<?php
// Установка нового пароля по токену из письма.
require __DIR__ . '/../lib.php';

$cfg = auth_config();
auth_cors($cfg);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}

$body = read_json_body();
$token = (string) ($body['token'] ?? '');
$password = (string) ($body['password'] ?? '');

if ($token === '' || mb_strlen($password) < 6) {
    send_json(['error' => 'bad_request'], 400);
}

$pdo = auth_db($cfg);
$stmt = $pdo->prepare(
    "SELECT id, user_id FROM email_tokens
     WHERE token = ? AND purpose = 'reset' AND used_at IS NULL AND expires_at > NOW() LIMIT 1"
);
$stmt->execute([$token]);
$row = $stmt->fetch();
if (!$row) {
    send_json(['error' => 'token_expired'], 400);
}

$userId = (int) $row['user_id'];
$pdo->prepare('UPDATE email_tokens SET used_at = NOW() WHERE id = ?')->execute([$row['id']]);
$pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
    ->execute([password_hash($password, PASSWORD_DEFAULT), $userId]);

// Сбрасываем прочие сессии для безопасности и выдаём новую
$pdo->prepare('DELETE FROM user_sessions WHERE user_id = ?')->execute([$userId]);
$token = create_session($pdo, $userId);

$u = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$u->execute([$userId]);
send_json([
    'token' => $token,
    'user'  => public_user($pdo, $u->fetch()),
]);
