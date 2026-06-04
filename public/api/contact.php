<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonResponse(['error' => 'Invalid JSON'], 400);
}

$source = $input['source'] ?? '';

if ($source === 'about') {
    handleContactForm($input);
} elseif ($source === 'add-server') {
    handleServerNotification($input);
} else {
    jsonResponse(['error' => 'Unknown source'], 400);
}

function escapeMarkdown($text) {
    return str_replace(
        ['*', '_', '`', '['],
        ['\\*', '\\_', '\\`', '\\['],
        $text
    );
}

function sendTelegram($text) {
    $url = 'https://api.telegram.org/bot' . TG_BOT_TOKEN . '/sendMessage';
    $payload = json_encode([
        'chat_id' => TG_CHAT_ID,
        'text' => $text,
        'parse_mode' => 'Markdown',
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    $ok = $httpCode >= 200 && $httpCode < 300;
    if (!$ok) {
        error_log("[sendTelegram] HTTP $httpCode curl=$curlError body=" . substr((string)$result, 0, 500));
    }
    return [
        'ok' => $ok,
        'http_code' => $httpCode,
        'curl_error' => $curlError,
        'response' => $result,
    ];
}

function handleContactForm($input) {
    $name = trim($input['name'] ?? '');
    $reply = trim($input['reply'] ?? '');
    $message = trim($input['message'] ?? '');

    if ($name === '' || $message === '') {
        jsonResponse(['error' => 'name and message are required'], 400);
    }

    $text = implode("\n", [
        "\xF0\x9F\x93\xA9 *Сообщение с сайта (О нас)*",
        '',
        '*Имя:* ' . escapeMarkdown($name),
        '*Контакт:* ' . escapeMarkdown($reply ?: '—'),
        '*Сообщение:* ' . escapeMarkdown($message),
    ]);

    $r = sendTelegram($text);
    if ($r['ok']) {
        jsonResponse(['ok' => true]);
    } else {
        jsonResponse(['error' => 'Failed to send', 'tg' => $r], 500);
    }
}

function handleServerNotification($input) {
    $fields = [
        'name' => $input['name'] ?? '—',
        'url' => $input['url'] ?? '—',
        'chronicle' => $input['chronicle'] ?? '—',
        'rate' => $input['rate'] ?? '—',
        'startDate' => $input['startDate'] ?? '—',
        'cardType' => $input['cardType'] ?? '—',
        'serverTypes' => $input['serverTypes'] ?? '—',
        'icons' => $input['icons'] ?? '—',
        'email' => $input['email'] ?? '—',
        'contacts' => $input['contacts'] ?? '—',
    ];

    $types = is_array($fields['serverTypes']) ? implode(', ', $fields['serverTypes']) : $fields['serverTypes'];
    $icons = is_array($fields['icons']) ? implode(', ', $fields['icons']) : $fields['icons'];

    $text = implode("\n", [
        "\xF0\x9F\x8E\xAE *Новая заявка на добавление сервера*",
        '',
        '*Название:* ' . escapeMarkdown($fields['name']),
        '*Сайт:* ' . escapeMarkdown($fields['url']),
        '*Хроники:* ' . escapeMarkdown($fields['chronicle']),
        '*Рейты:* ' . escapeMarkdown((string)$fields['rate']),
        '*Дата открытия:* ' . escapeMarkdown($fields['startDate']),
        '*Тариф:* ' . escapeMarkdown($fields['cardType']),
        '*Тип сервера:* ' . escapeMarkdown($types ?: '—'),
        '*Доп. значки:* ' . escapeMarkdown($icons ?: '—'),
        '*Email:* ' . escapeMarkdown($fields['email']),
        '*Контакты:* ' . escapeMarkdown($fields['contacts'] ?: '—'),
    ]);

    $r = sendTelegram($text);
    jsonResponse(['ok' => $r['ok'], 'tg' => $r]);
}
