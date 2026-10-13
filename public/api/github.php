<?php
/**
 * Запуск GitHub Actions с хостинга.
 *
 * Timeweb не пускает исходящие на api.telegram.org, поэтому в телегу пишет
 * раннер GitHub (scripts/notify-pending.js), а сайт только складывает заявки и
 * письма в базу. До api.github.com хостинг достаёт — этим и пользуемся:
 * форма кладёт запись в базу и тут же пинает воркфлоу уведомлений, чтобы он
 * отработал сразу, а не ждал крона. На крон полагаться нельзя: GitHub
 * задерживает расписания — вместо заявленных получаса воркфлоу поднимается
 * раз в 2–7 часов.
 *
 * Требует GH_WORKFLOW_PAT в secrets.php — fine-grained PAT с правом
 * Actions: Read and write на репозиторий GH_REPO (см. config.php).
 */

function ghRequest($method, $path, $body = null, $timeout = 15) {
    $ch = curl_init('https://api.github.com' . $path);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . GH_WORKFLOW_PAT,
            'Accept: application/vnd.github+json',
            'User-Agent: l2gm-admin',
            'X-GitHub-Api-Version: 2022-11-28',
        ],
    ]);
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, $res ? json_decode($res, true) : null];
}

/**
 * Пнуть notify-applications.yml — новая заявка или письмо уже в базе.
 *
 * Вызывается после того, как запись сохранена: ответ форме отдаём не дожидаясь
 * GitHub (shutdown-функция), ошибку глотаем. Если дёрнуть не вышло — запись
 * никуда не денется, её заберёт следующий запуск по крону, курсор в
 * .github/notified-applications.json общий.
 */
function ghDispatchNotify() {
    // Ответ формы (jsonResponse ниже по коду) копим в буфере, чтобы в
    // shutdown-функции знать его длину и отдать браузеру целиком до запроса в
    // GitHub.
    ob_start();
    register_shutdown_function(function () {
        ghFinishResponse();
        if (!defined('GH_WORKFLOW_PAT') || GH_WORKFLOW_PAT === '') {
            return;
        }
        [$code, $data] = ghRequest(
            'POST',
            '/repos/' . GH_REPO . '/actions/workflows/notify-applications.yml/dispatches',
            ['ref' => 'main'],
            10
        );
        if ($code !== 204) {
            error_log('ghDispatchNotify: GitHub API HTTP ' . $code . ' ' . json_encode($data));
        }
    });
}

/**
 * Отдать клиенту ответ и закрыть соединение, а скрипт пусть работает дальше.
 *
 * fastcgi_finish_request есть только под PHP-FPM. На Timeweb PHP работает без
 * него, и форма «Добавить сервер» крутилась, пока сайт ждал GitHub — до 15
 * секунд. Запасной путь: Content-Length + Connection: close и сброс буферов —
 * браузер получает ответ полностью и не ждёт конца скрипта.
 */
function ghFinishResponse() {
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
        return;
    }
    if (function_exists('litespeed_finish_request')) {
        litespeed_finish_request();
        return;
    }
    ignore_user_abort(true);
    // Сжатие на лету держит ответ до конца скрипта и ломает Content-Length.
    if (function_exists('apache_setenv')) {
        @apache_setenv('no-gzip', '1');
    }
    @ini_set('zlib.output_compression', '0');
    $body = '';
    while (ob_get_level() > 0) {
        $body = ob_get_clean() . $body;
    }
    if (!headers_sent()) {
        header('Content-Length: ' . strlen($body));
        header('Connection: close');
    }
    echo $body;
    flush();
}
