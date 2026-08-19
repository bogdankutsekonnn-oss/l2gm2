<?php
// Вход по email+паролю. Возвращает bearer-токен прямо в JSON.
require __DIR__ . '/../lib.php';

$cfg = auth_config();
auth_cors($cfg);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}
if (!rate_limit('login', 10, 900)) {
    send_json(['error' => 'too_many_requests'], 429);
}

$body = read_json_body();
$email = mb_strtolower(trim((string) ($body['email'] ?? '')));
$password = (string) ($body['password'] ?? '');

if ($email === '' || $password === '') {
    send_json(['error' => 'bad_request'], 400);
}

$pdo = auth_db($cfg);

// Пользователь по email-identity
$stmt = $pdo->prepare(
    "SELECT u.* FROM user_identities ui
     JOIN users u ON u.id = ui.user_id
     WHERE ui.provider = 'email' AND ui.provider_uid = ? LIMIT 1"
);
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !$user['password_hash'] || !password_verify($password, $user['password_hash'])) {
    usleep(300000); // антибрутфорс
    send_json(['error' => 'invalid_credentials'], 401);
}
if ((int) $user['email_verified'] !== 1) {
    send_json(['error' => 'not_verified'], 403);
}

$token = create_session($pdo, (int) $user['id']);
send_json([
    'token' => $token,
    'user'  => public_user($pdo, $user),
]);
