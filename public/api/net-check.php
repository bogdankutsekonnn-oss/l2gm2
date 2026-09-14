<?php
/**
 * Диагностика исходящей связи с хостинга.
 *
 * GET /api/net-check.php — куда Timeweb выпускает соединения, а куда нет.
 *
 * Нужна вот зачем: уведомления о заявках ходят кружным путём (запись в базу →
 * раннер GitHub → телега) ровно потому, что 27.08.2026 хостинг не пускал
 * исходящие на api.telegram.org. Проверить это можно только отсюда, а не с
 * рабочей машины, и раньше проверка была разовой — результат жил в голове и в
 * комментариях. Теперь это кнопка в админке: видно и то, открылась ли телега
 * (тогда посредник не нужен вовсе), и то, достаёт ли сайт до api.github.com
 * (без этого не пнуть воркфлоу уведомлений).
 *
 * Токенов не отдаёт: только код ответа, время и текст ошибки curl.
 */

require_once __DIR__ . '/config.php';

requireAdmin();

function probe($url, $headers = []) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_USERAGENT => 'l2gm-netcheck',
    ]);
    $body = curl_exec($ch);
    $errno = curl_errno($ch);
    $out = [
        'httpCode' => (int)curl_getinfo($ch, CURLINFO_HTTP_CODE),
        'seconds'  => round(curl_getinfo($ch, CURLINFO_TOTAL_TIME), 2),
        'error'    => $errno ? $errno . ': ' . curl_error($ch) : null,
        'reply'    => $body === false ? null : mb_substr((string)$body, 0, 200),
    ];
    curl_close($ch);
    // Ответ с кодом — связь есть, даже если код не 200: значит до сервиса
    // достучались, дальше вопрос токена. Пустой код при ошибке curl — это и
    // есть блокировка: соединение висит до таймаута.
    $out['reachable'] = $out['httpCode'] > 0;
    return $out;
}

$telegram = (defined('TG_BOT_TOKEN') && TG_BOT_TOKEN !== '')
    ? probe('https://api.telegram.org/bot' . TG_BOT_TOKEN . '/getMe')
    : ['error' => 'TG_BOT_TOKEN не задан в secrets.php', 'reachable' => null];

$github = probe('https://api.github.com/rate_limit');

jsonResponse([
    'telegram' => $telegram,
    'github' => $github,
    // Сам токен не показываем — только факт, что деплой его подставил.
    'ghTokenSet' => defined('GH_WORKFLOW_PAT') && GH_WORKFLOW_PAT !== '',
]);
