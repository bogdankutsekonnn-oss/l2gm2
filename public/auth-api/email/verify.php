<?php
// Подтверждение почты по ссылке из письма. Помечает email verified,
// создаёт сессию и редиректит на фронт с одноразовым кодом.
require __DIR__ . '/../lib.php';

$cfg = auth_config();
$token = (string) ($_GET['token'] ?? '');

if ($token === '') {
    redirect_with_error($cfg, 'bad_token');
}

$pdo = auth_db($cfg);
$stmt = $pdo->prepare(
    "SELECT id, user_id FROM email_tokens
     WHERE token = ? AND purpose = 'verify' AND used_at IS NULL AND expires_at > NOW() LIMIT 1"
);
$stmt->execute([$token]);
$row = $stmt->fetch();
if (!$row) {
    redirect_with_error($cfg, 'token_expired');
}

$userId = (int) $row['user_id'];

// email этого пользователя (из email-identity)
$emStmt = $pdo->prepare("SELECT provider_uid FROM user_identities WHERE user_id = ? AND provider = 'email' LIMIT 1");
$emStmt->execute([$userId]);
$email = $emStmt->fetchColumn() ?: null;

$pdo->prepare('UPDATE email_tokens SET used_at = NOW() WHERE id = ?')->execute([$row['id']]);
// проставляем email, только если он не занят другим аккаунтом
if ($email) {
    $chk = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1');
    $chk->execute([$email, $userId]);
    if (!$chk->fetch()) {
        $pdo->prepare('UPDATE users SET email = ?, email_verified = 1 WHERE id = ?')->execute([$email, $userId]);
    } else {
        $pdo->prepare('UPDATE users SET email_verified = 1 WHERE id = ?')->execute([$userId]);
    }
} else {
    $pdo->prepare('UPDATE users SET email_verified = 1 WHERE id = ?')->execute([$userId]);
}

$sessionToken = create_session($pdo, $userId);
$code = make_handoff($pdo, $sessionToken);
redirect_to_frontend($cfg, $code);
