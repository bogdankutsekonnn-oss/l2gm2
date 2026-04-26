<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// GET без action — публичный список
if ($method === 'GET' && $action === '') {
    listMerchants();
    exit;
}

if ($method === 'GET' && $action === 'conflicts') {
    conflictsAction();
    exit;
}

// Остальное — только авторизованным
$user = requireUser();

switch ($action) {
    case 'add':     addMerchant($user); break;
    case 'update':  updateMerchant($user); break;
    case 'archive': archiveMerchant($user); break;
    case 'set-slot':    setSlot($user); break;
    case 'clear-slot':  clearSlot($user); break;
    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}

// ----------------------------------------------------------------

// GET /api/merchants.php
function listMerchants() {
    $db = getDB();
    $merchants = $db->query(
        'SELECT m.id, m.name, m.city, m.role, m.status, m.notes,
                m.created_at, m.updated_at,
                cu.username AS created_by, uu.username AS updated_by
         FROM merchants m
         LEFT JOIN admin_users cu ON cu.id = m.created_by_user_id
         LEFT JOIN admin_users uu ON uu.id = m.updated_by_user_id
         ORDER BY m.status ASC, m.city ASC, m.name ASC'
    )->fetchAll();

    if (!$merchants) {
        jsonResponse(['merchants' => []]);
    }

    $ids = array_column($merchants, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $slots = $db->prepare(
        "SELECT s.id, s.merchant_id, s.slot_index, s.resource_id,
                s.price_per_unit, s.qty, s.updated_at,
                u.username AS updated_by,
                r.slug AS resource_slug, r.name AS resource_name, r.icon AS resource_icon,
                r.buy_avg, r.sell_avg
         FROM merchant_slots s
         JOIN resources r ON r.id = s.resource_id
         LEFT JOIN admin_users u ON u.id = s.updated_by_user_id
         WHERE s.merchant_id IN ($placeholders)
         ORDER BY s.slot_index ASC"
    );
    $slots->execute($ids);
    $slotsByMerchant = [];
    foreach ($slots->fetchAll() as $s) {
        $s['id']             = (int)$s['id'];
        $s['merchant_id']    = (int)$s['merchant_id'];
        $s['slot_index']     = (int)$s['slot_index'];
        $s['resource_id']    = (int)$s['resource_id'];
        $s['price_per_unit'] = $s['price_per_unit'] !== null ? (int)$s['price_per_unit'] : null;
        $s['qty']            = $s['qty'] !== null ? (int)$s['qty'] : null;
        $s['buy_avg']        = $s['buy_avg'] !== null ? (int)$s['buy_avg'] : null;
        $s['sell_avg']       = $s['sell_avg'] !== null ? (int)$s['sell_avg'] : null;
        $slotsByMerchant[$s['merchant_id']][] = $s;
    }

    foreach ($merchants as &$m) {
        $m['id'] = (int)$m['id'];
        $m['slots'] = $slotsByMerchant[$m['id']] ?? [];
    }

    jsonResponse(['merchants' => $merchants]);
}

// POST /api/merchants.php?action=add  body: {name, city, role, notes?}
function addMerchant($user) {
    $input = jsonInput();
    $name = trim($input['name'] ?? '');
    $city = $input['city'] ?? '';
    $role = $input['role'] ?? 'sell';
    $notes = $input['notes'] ?? null;

    if ($name === '') jsonResponse(['error' => 'name required'], 400);
    if (!isValidCity($city)) jsonResponse(['error' => 'Invalid city'], 400);
    if (!in_array($role, ['buy','sell'], true)) jsonResponse(['error' => 'Invalid role'], 400);

    $db = getDB();
    try {
        $db->prepare(
            'INSERT INTO merchants (name, city, role, notes, created_by_user_id, updated_by_user_id)
             VALUES (:n, :c, :r, :nt, :u, :u)'
        )->execute([
            ':n' => $name, ':c' => $city, ':r' => $role,
            ':nt' => $notes, ':u' => $user['user_id'],
        ]);
        $id = (int)$db->lastInsertId();
        jsonResponse(['success' => true, 'id' => $id]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            jsonResponse(['error' => 'Торговец с таким ником уже существует'], 409);
        }
        jsonResponse(['error' => 'DB error'], 500);
    }
}

// PUT /api/merchants.php?action=update&id=X  body: {name?, city?, role?, status?, notes?}
function updateMerchant($user) {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'id required'], 400);

    $input = jsonInput();
    $allowed = ['name','city','role','status','notes'];
    $sets = [];
    $params = [':id' => $id, ':u' => $user['user_id']];

    foreach ($input as $k => $v) {
        if (!in_array($k, $allowed, true)) continue;
        if ($k === 'city' && !isValidCity($v)) jsonResponse(['error' => 'Invalid city'], 400);
        if ($k === 'role' && !in_array($v, ['buy','sell'], true)) jsonResponse(['error' => 'Invalid role'], 400);
        if ($k === 'status' && !in_array($v, ['active','paused','archived'], true)) jsonResponse(['error' => 'Invalid status'], 400);
        if ($k === 'name') {
            $v = trim($v);
            if ($v === '') jsonResponse(['error' => 'name cannot be empty'], 400);
        }
        $sets[] = "`$k` = :$k";
        $params[":$k"] = $v;
    }
    if (!$sets) jsonResponse(['error' => 'Nothing to update'], 400);

    $sets[] = "updated_by_user_id = :u";
    $sql = 'UPDATE merchants SET ' . implode(', ', $sets) . ' WHERE id = :id';

    $db = getDB();
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            jsonResponse(['error' => 'Торговец с таким ником уже существует'], 409);
        }
        jsonResponse(['error' => 'DB error'], 500);
    }
    jsonResponse(['success' => true]);
}

// PUT /api/merchants.php?action=archive&id=X
function archiveMerchant($user) {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'id required'], 400);
    $db = getDB();
    $db->prepare('UPDATE merchants SET status = "archived", updated_by_user_id = :u WHERE id = :id')
       ->execute([':id' => $id, ':u' => $user['user_id']]);
    jsonResponse(['success' => true]);
}

// PUT /api/merchants.php?action=set-slot&id=MERCHANT_ID
//   body: {slot_index: 1..5, resource_slug: "...", price_per_unit?, qty?}
function setSlot($user) {
    $merchantId = (int)($_GET['id'] ?? 0);
    if (!$merchantId) jsonResponse(['error' => 'merchant id required'], 400);

    $input = jsonInput();
    $slotIndex = (int)($input['slot_index'] ?? 0);
    if ($slotIndex < 1 || $slotIndex > 5) jsonResponse(['error' => 'slot_index must be 1..5'], 400);

    $slug = trim($input['resource_slug'] ?? '');
    if ($slug === '') jsonResponse(['error' => 'resource_slug required'], 400);

    $price = $input['price_per_unit'] ?? null;
    $qty = $input['qty'] ?? null;
    if ($price !== null && $price !== '' && (!is_numeric($price) || $price < 0)) jsonResponse(['error' => 'Invalid price'], 400);
    if ($qty !== null && $qty !== '' && (!is_numeric($qty) || $qty < 0)) jsonResponse(['error' => 'Invalid qty'], 400);
    $price = ($price === null || $price === '') ? null : (int)$price;
    $qty   = ($qty === null || $qty === '') ? null : (int)$qty;

    $db = getDB();
    $r = $db->prepare('SELECT id FROM resources WHERE slug = :s');
    $r->execute([':s' => $slug]);
    $res = $r->fetch();
    if (!$res) jsonResponse(['error' => 'Resource not found'], 404);

    $m = $db->prepare('SELECT id FROM merchants WHERE id = :id');
    $m->execute([':id' => $merchantId]);
    if (!$m->fetch()) jsonResponse(['error' => 'Merchant not found'], 404);

    $db->prepare(
        'INSERT INTO merchant_slots (merchant_id, slot_index, resource_id, price_per_unit, qty, updated_by_user_id)
         VALUES (:m, :i, :r, :p, :q, :u)
         ON DUPLICATE KEY UPDATE
            resource_id = VALUES(resource_id),
            price_per_unit = VALUES(price_per_unit),
            qty = VALUES(qty),
            updated_by_user_id = VALUES(updated_by_user_id)'
    )->execute([
        ':m' => $merchantId, ':i' => $slotIndex, ':r' => $res['id'],
        ':p' => $price, ':q' => $qty, ':u' => $user['user_id'],
    ]);

    // Также обновим merchants.updated_by_user_id
    $db->prepare('UPDATE merchants SET updated_by_user_id = :u WHERE id = :id')
       ->execute([':id' => $merchantId, ':u' => $user['user_id']]);

    jsonResponse(['success' => true]);
}

// PUT /api/merchants.php?action=clear-slot&id=MERCHANT_ID&slot=1
function clearSlot($user) {
    $merchantId = (int)($_GET['id'] ?? 0);
    $slot = (int)($_GET['slot'] ?? 0);
    if (!$merchantId || $slot < 1 || $slot > 5) jsonResponse(['error' => 'invalid params'], 400);

    $db = getDB();
    $db->prepare('DELETE FROM merchant_slots WHERE merchant_id = :m AND slot_index = :i')
       ->execute([':m' => $merchantId, ':i' => $slot]);
    $db->prepare('UPDATE merchants SET updated_by_user_id = :u WHERE id = :id')
       ->execute([':id' => $merchantId, ':u' => $user['user_id']]);
    jsonResponse(['success' => true]);
}

// GET /api/merchants.php?action=conflicts&city=giran&role=sell&resource_slug=soul-ore&exclude_id=N
function conflictsAction() {
    $city = $_GET['city'] ?? '';
    $role = $_GET['role'] ?? '';
    $slug = trim($_GET['resource_slug'] ?? '');
    $excludeId = (int)($_GET['exclude_id'] ?? 0);
    if (!isValidCity($city) || !in_array($role, ['buy','sell'], true) || $slug === '') {
        jsonResponse(['conflicts' => []]);
    }
    $db = getDB();
    $sql = 'SELECT m.id, m.name, m.status, s.slot_index, s.price_per_unit
            FROM merchants m
            JOIN merchant_slots s ON s.merchant_id = m.id
            JOIN resources r ON r.id = s.resource_id
            WHERE m.city = :c AND m.role = :r AND r.slug = :s
              AND m.status = "active"';
    $params = [':c' => $city, ':r' => $role, ':s' => $slug];
    if ($excludeId) {
        $sql .= ' AND m.id <> :ex';
        $params[':ex'] = $excludeId;
    }
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse(['conflicts' => $stmt->fetchAll()]);
}

// ---- helpers ----
function isValidCity($c) {
    return in_array($c, [
        'talking-island','elven-village','dark-elf-village','orc-village','dwarven-village',
        'gludin','gludio','dion','giran','hunter-village','oren','heine','aden',
    ], true);
}

function jsonInput() {
    $input = json_decode(file_get_contents('php://input'), true);
    return is_array($input) ? $input : [];
}
