<?php
// Текущий пользователь по bearer-токену.
require __DIR__ . '/lib.php';

$cfg = auth_config();
auth_cors($cfg);

$pdo = auth_db($cfg);
$user = require_user($pdo);

send_json(['user' => public_user($pdo, $user)]);
