<?php
// Старт Yandex OAuth: редирект на страницу согласия Яндекса.
require __DIR__ . '/../lib.php';

$cfg = auth_config();
$state = oauth_set_state('yandex');

$params = [
    'response_type' => 'code',
    'client_id'     => $cfg['yandex_client_id'],
    'redirect_uri'  => rtrim($cfg['redirect_base'], '/') . '/auth-api/yandex/callback.php',
    'scope'         => 'login:email login:info login:avatar',
    'state'         => $state,
];

header('Location: https://oauth.yandex.ru/authorize?' . http_build_query($params));
exit;
