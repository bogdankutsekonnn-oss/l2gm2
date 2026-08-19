<?php
// Callback Yandex OAuth: обмен кода на профиль, создание сессии, редирект на фронт.
require __DIR__ . '/../lib.php';

$cfg = auth_config();

if (!empty($_GET['error']) || empty($_GET['code'])) {
    redirect_with_error($cfg, 'yandex_denied');
}
if (!oauth_check_state('yandex')) {
    redirect_with_error($cfg, 'bad_state');
}

// 1) code → access_token
$token = http_post_json('https://oauth.yandex.ru/token', [
    'grant_type'    => 'authorization_code',
    'code'          => $_GET['code'],
    'client_id'     => $cfg['yandex_client_id'],
    'client_secret' => $cfg['yandex_client_secret'],
]);
if (empty($token['access_token'])) {
    redirect_with_error($cfg, 'yandex_token');
}

// 2) access_token → профиль
$profile = http_get_json('https://login.yandex.ru/info?format=json', [
    'Authorization: OAuth ' . $token['access_token'],
]);
if (empty($profile['id'])) {
    redirect_with_error($cfg, 'yandex_profile');
}

// Аватар
$photo = null;
if (!empty($profile['default_avatar_id']) && empty($profile['is_avatar_empty'])) {
    $photo = 'https://avatars.yandex.net/get-yapic/' . $profile['default_avatar_id'] . '/islands-200';
}
$name = $profile['display_name'] ?? $profile['real_name'] ?? $profile['login'] ?? null;
$email = $profile['default_email'] ?? ($profile['emails'][0] ?? null);

$pdo = auth_db($cfg);
$userId = find_or_create_user(
    $pdo,
    'yandex',
    (string) $profile['id'],
    $email,
    $name,
    $photo,
    !empty($email) // у Яндекса email аккаунта считается подтверждённым
);

$sessionToken = create_session($pdo, $userId);
$code = make_handoff($pdo, $sessionToken);
redirect_to_frontend($cfg, $code);
