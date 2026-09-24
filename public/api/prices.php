<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// GET без action → публичный список (можно вытащить и неавторизованным)
if ($method === 'GET' && $action === '') {
    listPrices();
    exit;
}

// История — публичная (только чтение)
if ($method === 'GET' && $action === 'history') {
    historyAction();
    exit;
}

// Всё остальное — только для авторизованных
$user = requireUser();

switch ($action) {
    case 'update': updatePrices($user); break;
    case 'bulk':   bulkUpdate($user); break;
    case 'seed':   seedAction($user); break;
    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}

// ----------------------------------------------------------------

// GET /api/prices.php
function listPrices() {
    $db = getDB();
    $rows = $db->query(
        'SELECT id, slug, name, icon, category, recipe, yield_qty, sort_order,
                buy_avg, buy_max, sell_avg, sell_min,
                buy_updated_at, sell_updated_at, updated_at
         FROM resources
         ORDER BY sort_order ASC, id ASC'
    )->fetchAll();

    foreach ($rows as &$r) {
        $r['id']        = (int)$r['id'];
        $r['yield_qty'] = (int)$r['yield_qty'];
        $r['sort_order']= (int)$r['sort_order'];
        $r['buy_avg']   = $r['buy_avg']   !== null ? (int)$r['buy_avg']   : null;
        $r['buy_max']   = $r['buy_max']   !== null ? (int)$r['buy_max']   : null;
        $r['sell_avg']  = $r['sell_avg']  !== null ? (int)$r['sell_avg']  : null;
        $r['sell_min']  = $r['sell_min']  !== null ? (int)$r['sell_min']  : null;
        $r['recipe']    = $r['recipe'] ? json_decode($r['recipe'], true) : null;
    }
    jsonResponse(['resources' => $rows]);
}

// PUT /api/prices.php?action=update&slug=mithril-alloy
// body: {buy_avg?, buy_max?, sell_avg?, sell_min?}  (можно null чтобы очистить)
function updatePrices($user) {
    $slug = trim($_GET['slug'] ?? '');
    if ($slug === '') jsonResponse(['error' => 'slug required'], 400);

    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) jsonResponse(['error' => 'Invalid JSON'], 400);

    $updates = parsePriceFields($input);
    if (!$updates) jsonResponse(['error' => 'Nothing to update'], 400);

    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM resources WHERE slug = :s LIMIT 1');
    $stmt->execute([':s' => $slug]);
    $res = $stmt->fetch();
    if (!$res) jsonResponse(['error' => 'Resource not found'], 404);

    $db->beginTransaction();
    try {
        $changed = applyPriceChanges($db, $res, $updates, $user['user_id']);
        if (!$changed) {
            $db->rollBack();
            jsonResponse(['success' => true, 'changed' => false]);
        }
        $db->commit();
    } catch (Throwable $e) {
        $db->rollBack();
        jsonResponse(['error' => 'DB error: ' . $e->getMessage()], 500);
    }

    // Вернём свежий объект
    $stmt = $db->prepare('SELECT * FROM resources WHERE id = :id');
    $stmt->execute([':id' => $res['id']]);
    $fresh = $stmt->fetch();
    foreach (['buy_avg','buy_max','sell_avg','sell_min'] as $k) {
        $fresh[$k] = $fresh[$k] !== null ? (int)$fresh[$k] : null;
    }
    $fresh['recipe'] = $fresh['recipe'] ? json_decode($fresh['recipe'], true) : null;

    jsonResponse(['success' => true, 'resource' => $fresh, 'changes' => $changed]);
}

// Поля цены из тела запроса: только разрешённые, '' / null — очистка.
function parsePriceFields($input) {
    $allowed = ['buy_avg', 'buy_max', 'sell_avg', 'sell_min'];
    $updates = [];
    foreach ($input as $k => $v) {
        if (!in_array($k, $allowed, true)) continue;
        if ($v === '' || $v === null) {
            $updates[$k] = null;
        } else {
            if (!is_numeric($v) || $v < 0) {
                jsonResponse(['error' => "Field $k must be a non-negative number"], 400);
            }
            $updates[$k] = (int)round($v);
        }
    }
    return $updates;
}

// Пишет изменившиеся поля ресурса + price_history. Транзакция — на вызывающем.
// Возвращает число изменённых полей (0 — ничего не поменялось, UPDATE не делаем).
function applyPriceChanges($db, $res, $updates, $userId) {
    $touchBuy  = false;
    $touchSell = false;
    $changes   = [];

    foreach ($updates as $f => $newV) {
        $oldV = $res[$f] !== null ? (int)$res[$f] : null;
        if ($oldV === $newV) continue; // ничего не поменялось

        $changes[] = ['field' => $f, 'old' => $oldV, 'new' => $newV];

        if ($f === 'buy_avg' || $f === 'buy_max')   $touchBuy  = true;
        if ($f === 'sell_avg' || $f === 'sell_min') $touchSell = true;
    }
    if (!$changes) return 0;

    $sets = [];
    $params = [':id' => $res['id']];
    foreach ($changes as $c) {
        $sets[] = "`{$c['field']}` = :{$c['field']}";
        $params[":{$c['field']}"] = $c['new'];
    }
    if ($touchBuy)  $sets[] = "buy_updated_at = NOW()";
    if ($touchSell) $sets[] = "sell_updated_at = NOW()";

    $db->prepare('UPDATE resources SET ' . implode(', ', $sets) . ' WHERE id = :id')
       ->execute($params);

    $hist = $db->prepare(
        'INSERT INTO price_history (resource_id, field, old_value, new_value, user_id)
         VALUES (:rid, :f, :ov, :nv, :uid)'
    );
    foreach ($changes as $c) {
        $hist->execute([
            ':rid' => $res['id'],
            ':f'   => $c['field'],
            ':ov'  => $c['old'],
            ':nv'  => $c['new'],
            ':uid' => $userId,
        ]);
    }
    return count($changes);
}

// POST /api/prices.php?action=bulk
// body: {items: {"<slug>": {buy_avg?, buy_max?, sell_avg?, sell_min?}, ...}}
// Пакетное обновление одной транзакцией — для автозабора цен с GiranInfo
// (scripts/sync-giran-prices.js). Незнакомые slug пропускаются, а не роняют пакет.
function bulkUpdate($user) {
    $input = json_decode(file_get_contents('php://input'), true);
    $items = is_array($input) ? ($input['items'] ?? null) : null;
    if (!is_array($items) || !$items) jsonResponse(['error' => 'items required'], 400);

    $parsed = [];
    foreach ($items as $slug => $fields) {
        if (!is_array($fields)) continue;
        $u = parsePriceFields($fields);
        if ($u) $parsed[(string)$slug] = $u;
    }

    $db = getDB();
    $sel = $db->prepare('SELECT * FROM resources WHERE slug = :s LIMIT 1');
    $updated = 0; $fields = 0; $unknown = [];

    $db->beginTransaction();
    try {
        foreach ($parsed as $slug => $updates) {
            $sel->execute([':s' => $slug]);
            $res = $sel->fetch();
            if (!$res) { $unknown[] = $slug; continue; }
            $n = applyPriceChanges($db, $res, $updates, $user['user_id']);
            if ($n) { $updated++; $fields += $n; }
        }
        $db->commit();
    } catch (Throwable $e) {
        $db->rollBack();
        jsonResponse(['error' => 'DB error: ' . $e->getMessage()], 500);
    }

    jsonResponse([
        'success'  => true,
        'received' => count($parsed),
        'updated'  => $updated,
        'fields'   => $fields,
        'unknown'  => $unknown,
    ]);
}

// GET /api/prices.php?action=history&slug=...&field=buy_avg&limit=20
function historyAction() {
    $slug  = trim($_GET['slug'] ?? '');
    $field = trim($_GET['field'] ?? '');
    $limit = max(1, min(100, (int)($_GET['limit'] ?? 20)));
    if ($slug === '') jsonResponse(['error' => 'slug required'], 400);

    $allowed = ['buy_avg','buy_max','sell_avg','sell_min'];
    $db = getDB();
    $stmt = $db->prepare('SELECT id FROM resources WHERE slug = :s');
    $stmt->execute([':s' => $slug]);
    $r = $stmt->fetch();
    if (!$r) jsonResponse(['error' => 'Resource not found'], 404);

    if ($field !== '' && !in_array($field, $allowed, true)) {
        jsonResponse(['error' => 'Invalid field'], 400);
    }

    if ($field !== '') {
        $sql = 'SELECT h.field, h.old_value, h.new_value, h.changed_at, u.username
                FROM price_history h
                LEFT JOIN admin_users u ON u.id = h.user_id
                WHERE h.resource_id = :rid AND h.field = :f
                ORDER BY h.changed_at DESC LIMIT ' . $limit;
        $stmt = $db->prepare($sql);
        $stmt->execute([':rid' => $r['id'], ':f' => $field]);
    } else {
        $sql = 'SELECT h.field, h.old_value, h.new_value, h.changed_at, u.username
                FROM price_history h
                LEFT JOIN admin_users u ON u.id = h.user_id
                WHERE h.resource_id = :rid
                ORDER BY h.changed_at DESC LIMIT ' . $limit;
        $stmt = $db->prepare($sql);
        $stmt->execute([':rid' => $r['id']]);
    }
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row['old_value'] = $row['old_value'] !== null ? (int)$row['old_value'] : null;
        $row['new_value'] = $row['new_value'] !== null ? (int)$row['new_value'] : null;
    }
    jsonResponse(['history' => $rows]);
}

// POST /api/prices.php?action=seed (только мастер-токен)
// Загружает prices-seed.json: вставляет новые, обновляет name/icon/category/recipe/yield_qty/sort_order,
// цены НЕ трогает. Безопасно перезапускать.
function seedAction($user) {
    if ($user['user_id'] !== null) {
        // обычным юзерам не разрешаем seed — только мастер-токен
        jsonResponse(['error' => 'Master token required for seed'], 403);
    }

    $path = __DIR__ . '/prices-seed.json';
    if (!file_exists($path)) jsonResponse(['error' => 'prices-seed.json not found'], 500);
    $data = json_decode(file_get_contents($path), true);
    if (!is_array($data)) jsonResponse(['error' => 'Invalid seed JSON'], 500);

    $db = getDB();
    $inserted = 0; $updated = 0;

    $sql = 'INSERT INTO resources (slug, name, icon, category, recipe, yield_qty, sort_order)
            VALUES (:slug, :name, :icon, :category, :recipe, :yield_qty, :sort_order)
            ON DUPLICATE KEY UPDATE
              name       = VALUES(name),
              icon       = VALUES(icon),
              category   = VALUES(category),
              recipe     = VALUES(recipe),
              yield_qty  = VALUES(yield_qty),
              sort_order = VALUES(sort_order)';
    $stmt = $db->prepare($sql);

    $slugs = [];
    foreach ($data as $r) {
        $slugs[] = $r['slug'];
        $stmt->execute([
            ':slug'       => $r['slug'],
            ':name'       => $r['name'],
            ':icon'       => $r['icon'],
            ':category'   => $r['category'],
            ':recipe'     => isset($r['recipe']) ? json_encode($r['recipe'], JSON_UNESCAPED_UNICODE) : null,
            ':yield_qty'  => $r['yield_qty'] ?? 1,
            ':sort_order' => $r['sort_order'] ?? 0,
        ]);
        // rowCount: 1 insert, 2 update, 0 no-change
        $rc = $stmt->rowCount();
        if ($rc === 1) $inserted++;
        elseif ($rc === 2) $updated++;
    }

    // Удаляем ресурсы, которых нет в JSON (синхронизация). История по ним удалится по CASCADE.
    $deleted = 0;
    if ($slugs) {
        $placeholders = implode(',', array_fill(0, count($slugs), '?'));
        $del = $db->prepare("DELETE FROM resources WHERE slug NOT IN ($placeholders)");
        $del->execute($slugs);
        $deleted = $del->rowCount();
    }

    jsonResponse([
        'success'  => true,
        'total'    => count($data),
        'inserted' => $inserted,
        'updated'  => $updated,
        'deleted'  => $deleted,
    ]);
}
