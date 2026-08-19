<?php
// Callback Google OAuth: обмен кода на профиль, создание сессии, редирект на фронт.
require __DIR__ . '/../lib.php';

$cfg = auth_config();

if (!empty($_GET['error']) || empty($_GET['code'])) {
    redirect_with_error($cfg, 'google_denied');
}
if (!oauth_check_state('google')) {
    redirect_with_error($cfg, 'bad_state');
}

$redirectUri = rtrim($cfg['redirect_base'], '/') . '/auth-api/google/callback.php';

// 1) code → access_token
$token = http_post_json('https://oauth2.googleapis.com/token', [
    'code'          => $_GET['code'],
    'client_id'     => $cfg['google_client_id'],
    'client_secret' => $cfg['google_client_secret'],
    'redirect_uri'  => $redirectUri,
    'grant_type'    => 'authorization_code',
]);
if (empty($token['access_token'])) {
    redirect_with_error($cfg, 'google_token');
}

// 2) access_token → профиль
$profile = http_get_json('https://www.googleapis.com/oauth2/v3/userinfo', [
    'Authorization: Bearer ' . $token['access_token'],
]);
if (empty($profile['sub'])) {
    redirect_with_error($cfg, 'google_profile');
}

$pdo = auth_db($cfg);
$userId = find_or_create_user(
    $pdo,
    'google',
    (string) $profile['sub'],
    $profile['email'] ?? null,
    $profile['name'] ?? null,
    $profile['picture'] ?? null,
    !empty($profile['email_verified'])
);

$sessionToken = create_session($pdo, $userId);
$code = make_handoff($pdo, $sessionToken);
redirect_to_frontend($cfg, $code);
