<?php
// Запрос сброса пароля. Всегда отвечает success (без раскрытия наличия аккаунта).
require __DIR__ . '/../lib.php';

$cfg = auth_config();
auth_cors($cfg);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}
if (!rate_limit('reset_req', 5, 3600)) {
    send_json(['error' => 'too_many_requests'], 429);
}

$body = read_json_body();
$email = mb_strtolower(trim((string) ($body['email'] ?? '')));

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $pdo = auth_db($cfg);
    $stmt = $pdo->prepare(
        "SELECT u.id FROM user_identities ui
         JOIN users u ON u.id = ui.user_id
         WHERE ui.provider = 'email' AND ui.provider_uid = ? AND u.password_hash IS NOT NULL LIMIT 1"
    );
    $stmt->execute([$email]);
    $u = $stmt->fetch();
    if ($u) {
        $token = bin2hex(random_bytes(32));
        $pdo->prepare(
            "INSERT INTO email_tokens (user_id, purpose, token, expires_at)
             VALUES (?, 'reset', ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))"
        )->execute([(int) $u['id'], $token]);

        $link = rtrim($cfg['redirect_base'], '/') . '/auth/reset/?token=' . $token;
        $html = '<div style="font-family:sans-serif;font-size:15px;color:#111">'
            . '<p>Сброс пароля на <b>L2GM</b>:</p>'
            . '<p><a href="' . htmlspecialchars($link) . '" style="display:inline-block;padding:10px 18px;background:#fe3600;color:#fff;border-radius:8px;text-decoration:none">Задать новый пароль</a></p>'
            . '<p style="color:#666;font-size:13px">Ссылка действует 1 час. Если вы не запрашивали сброс — проигнорируйте письмо.</p>'
            . '</div>';
        send_mail($cfg, $email, 'Сброс пароля — L2GM', $html);
    }
}

send_json(['success' => true]);
