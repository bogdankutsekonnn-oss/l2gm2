<?php
// Старт Google OAuth: редирект на страницу согласия Google.
require __DIR__ . '/../lib.php';

$cfg = auth_config();
$state = oauth_set_state('google');

$params = [
    'client_id'     => $cfg['google_client_id'],
    'redirect_uri'  => rtrim($cfg['redirect_base'], '/') . '/auth-api/google/callback.php',
    'response_type' => 'code',
    'scope'         => 'openid email profile',
    'state'         => $state,
    'access_type'   => 'online',
    'prompt'        => 'select_account',
];

header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params));
exit;
