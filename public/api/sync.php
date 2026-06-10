<?php
/**
 * Синк сайта из админки: запуск GitHub Actions.
 *
 * POST /api/sync.php?action=run    — запустить sync-servers.yml
 *                                    (мёрж базы в servers.json → коммит → деплой)
 * GET  /api/sync.php?action=status — статус последних ранов синка и деплоя
 *
 * Требует GH_WORKFLOW_PAT в secrets.php — fine-grained PAT с правом
 * Actions: Read and write на репозиторий GH_REPO (см. config.php).
 */

require_once __DIR__ . '/config.php';

requireAdmin();

if (!defined('GH_WORKFLOW_PAT') || GH_WORKFLOW_PAT === '') {
    jsonResponse(['error' => 'GH_WORKFLOW_PAT не задан в secrets.php'], 500);
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'run':
        runSync();
        break;
    case 'status':
        syncStatus();
        break;
    default:
        jsonResponse(['error' => 'Unknown action. Use: run, status'], 400);
}

function ghRequest($method, $path, $body = null) {
    $ch = curl_init('https://api.github.com' . $path);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_TIMEOUT => 15,
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

// POST ?action=run — workflow_dispatch синка
function runSync() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'POST required'], 405);
    }
    [$code, $data] = ghRequest(
        'POST',
        '/repos/' . GH_REPO . '/actions/workflows/sync-servers.yml/dispatches',
        ['ref' => 'main']
    );
    if ($code === 204) {
        jsonResponse(['success' => true, 'message' => 'Синк запущен. Сайт обновится через ~3–5 минут.']);
    }
    jsonResponse(['error' => 'GitHub API: HTTP ' . $code, 'details' => $data], 502);
}

// GET ?action=status — последний ран синка и деплоя
function syncStatus() {
    $result = [];
    foreach (['sync-servers.yml' => 'sync', 'deploy.yml' => 'deploy'] as $wf => $label) {
        [$code, $data] = ghRequest('GET', '/repos/' . GH_REPO . '/actions/workflows/' . $wf . '/runs?per_page=1');
        $run = ($code === 200 && !empty($data['workflow_runs'][0])) ? $data['workflow_runs'][0] : null;
        $result[$label] = $run ? [
            'status'     => $run['status'],      // queued | in_progress | completed
            'conclusion' => $run['conclusion'],  // success | failure | null
            'created_at' => $run['created_at'],
            'updated_at' => $run['updated_at'],
            'html_url'   => $run['html_url'],
        ] : null;
    }
    jsonResponse($result);
}
