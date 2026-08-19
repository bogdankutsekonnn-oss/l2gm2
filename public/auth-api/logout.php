<?php
// Завершение сессии (удаляет текущий токен).
require __DIR__ . '/lib.php';

$cfg = auth_config();
auth_cors($cfg);

$token = get_bearer_token();
if ($token !== '') {
    $pdo = auth_db($cfg);
    $pdo->prepare('DELETE FROM user_sessions WHERE token = ?')->execute([$token]);
}

send_json(['success' => true]);
