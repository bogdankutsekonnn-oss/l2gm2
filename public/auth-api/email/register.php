<?php
// Регистрация по email+паролю. Создаёт неподтверждённый аккаунт и шлёт письмо.
require __DIR__ . '/../lib.php';

$cfg = auth_config();
auth_cors($cfg);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}
if (!rate_limit('register', 5, 3600)) {
    send_json(['error' => 'too_many_requests'], 429);
}

$body = read_json_body();
$email = mb_strtolower(trim((string) ($body['email'] ?? '')));
$password = (string) ($body['password'] ?? '');
$name = trim(strip_tags((string) ($body['name'] ?? '')));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(['error' => 'bad_email'], 400);
}
if (mb_strlen($password) < 6) {
    send_json(['error' => 'weak_password'], 400);
}

$pdo = auth_db($cfg);

// Есть ли уже email-identity?
$stmt = $pdo->prepare("SELECT user_id FROM user_identities WHERE provider = 'email' AND provider_uid = ? LIMIT 1");
$stmt->execute([$email]);
$existing = $stmt->fetch();

if ($existing) {
    $userId = (int) $existing['user_id'];
    $u = $pdo->prepare('SELECT email_verified FROM users WHERE id = ?');
    $u->execute([$userId]);
    if ((int) $u->fetchColumn() === 1) {
        send_json(['error' => 'email_taken'], 409);
    }
    // не подтверждён — обновим пароль и перешлём письмо
    $pdo->prepare('UPDATE users SET password_hash = ?, display_name = COALESCE(display_name, ?) WHERE id = ?')
        ->execute([password_hash($password, PASSWORD_DEFAULT), $name ?: null, $userId]);
} else {
    // Привязка к существующему OAuth-аккаунту с тем же email, либо новый пользователь
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $u = $stmt->fetch();
    if ($u) {
        $userId = (int) $u['id'];
        $pdo->prepare('UPDATE users SET password_hash = ?, display_name = COALESCE(display_name, ?) WHERE id = ?')
            ->execute([password_hash($password, PASSWORD_DEFAULT), $name ?: null, $userId]);
    } else {
        $pdo->prepare('INSERT INTO users (display_name, password_hash, email_verified) VALUES (?, ?, 0)')
            ->execute([$name ?: null, password_hash($password, PASSWORD_DEFAULT)]);
        $userId = (int) $pdo->lastInsertId();
    }
    link_identity($pdo, $userId, 'email', $email);
}

// Токен подтверждения (сутки)
$token = bin2hex(random_bytes(32));
$pdo->prepare(
    "INSERT INTO email_tokens (user_id, purpose, token, expires_at)
     VALUES (?, 'verify', ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))"
)->execute([$userId, $token]);

$link = rtrim($cfg['redirect_base'], '/') . '/auth-api/email/verify.php?token=' . $token;
$html = '<div style="font-family:sans-serif;font-size:15px;color:#111">'
    . '<p>Подтвердите почту для входа на <b>L2GM</b>:</p>'
    . '<p><a href="' . htmlspecialchars($link) . '" style="display:inline-block;padding:10px 18px;background:#fe3600;color:#fff;border-radius:8px;text-decoration:none">Подтвердить email</a></p>'
    . '<p style="color:#666;font-size:13px">Если вы не регистрировались — просто проигнорируйте письмо.</p>'
    . '</div>';

send_mail($cfg, $email, 'Подтверждение почты — L2GM', $html);

send_json(['pending_verification' => true]);
