/**
 * L2GM → калькулятор крафта Lu4 (access.112312312.xyz/craft).
 * Подгружается закладкой (букмарклетом) прямо на странице калькулятора,
 * берёт наши цены из /api/prices.php и проставляет их в поля «цена».
 * craft.js там — ES-модуль, его state снаружи недоступен, поэтому цены
 * заходят через штатный импорт сценария (выбранный предмет сохраняется),
 * а если предмет не выбран — через localStorage + перезагрузку.
 * Запас (owned) и выбранные режимы игрока не трогаем.
 */
(async () => {
  const API = 'https://l2gm.com/api/prices.php';
  const STORAGE_KEY = 'lu4-craft-calculator-values-v1';
  const PANEL_ID = 'l2gm-bridge-panel';
  const RELOAD_DELAY = 3000;

  // Стандартные ID предметов — запасной путь, если имя в каталоге не совпало
  const ITEM_IDS = {
    'crystal-d': 1458, 'crystal-c': 1459, 'crystal-b': 1460, 'crystal-a': 1461,
    'gem-d': 2130, 'gem-c': 2131, 'gem-b': 2132, 'gem-a': 2133,
    'spirit-ore': 3031, 'soul-ore': 1785,
    'soulshot-d': 1463, 'soulshot-c': 1464, 'soulshot-b': 1465, 'soulshot-a': 1466,
    'spiritshot-d': 2510, 'spiritshot-c': 2511, 'spiritshot-b': 2512, 'spiritshot-a': 2513,
    'blessed-spiritshot-d': 3948, 'blessed-spiritshot-c': 3949, 'blessed-spiritshot-b': 3950, 'blessed-spiritshot-a': 3951,
    'varnish': 1865, 'stem': 1864, 'suede': 1866, 'animal-skin': 1867, 'thread': 1868, 'iron-ore': 1869,
    'coal': 1870, 'charcoal': 1871, 'animal-bone': 1872, 'silver-nugget': 1873, 'oriharukon-ore': 1874,
    'stone-of-purity': 1875, 'mithril-ore': 1876, 'adamantite-nugget': 1877,
    'braided-hemp': 1878, 'cokes': 1879, 'steel': 1880, 'coarse-bone-powder': 1881, 'leather': 1882,
    'steel-mold': 1883, 'cord': 1884, 'high-grade-suede': 1885, 'silver-mold': 1886, 'varnish-of-purity': 1887,
    'synthetic-cokes': 1888, 'compound-braid': 1889, 'mithril-alloy': 1890, 'artisans-frame': 1891,
    'blacksmiths-frame': 1892, 'oriharukon': 1893, 'crafted-leather': 1894, 'metallic-fiber': 1895,
    'mold-glue': 4039, 'mold-lubricant': 4040, 'mold-hardener': 4041, 'enria': 4042, 'asofe': 4043, 'thons': 4044,
    'maestro-holder': 4045, 'maestro-anvil-lock': 4046, 'craftsman-mold': 4047, 'maestro-mold': 4048,
    'metal-hardener': 5220, 'metallic-thread': 5549, 'durable-metal-plate': 5550,
    'warsmiths-mold': 5552, 'warsmiths-holder': 5554,
  };

  const MODES = {
    sell: { label: 'цены в магазинах продажи', pick: r => r.sell_avg ?? r.sell_min ?? r.buy_avg },
    buy:  { label: 'цены скупки', pick: r => r.buy_avg ?? r.buy_max ?? r.sell_avg },
  };

  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9а-яё]/g, '');
  const btn = 'margin:8px 6px 0 0;padding:4px 10px;border-radius:6px;cursor:pointer;font:inherit;';

  function panel(html) {
    let el = document.getElementById(PANEL_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = PANEL_ID;
      el.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:99999;max-width:360px;padding:14px 28px 14px 16px;' +
        'background:#1b1f27;color:#e8e8e8;border:1px solid #d4a64a;border-radius:10px;font:14px/1.45 system-ui,sans-serif;' +
        'box-shadow:0 8px 30px rgba(0,0,0,.5)';
      document.body.append(el);
    }
    el.innerHTML = '<b style="color:#d4a64a">L2GM</b> · ' + html +
      '<button data-close style="position:absolute;top:6px;right:8px;background:none;border:0;color:#999;font-size:18px;cursor:pointer">×</button>';
    el.querySelector('[data-close]').onclick = () => el.remove();
    return el;
  }

  if (!/\/craft\/?$/.test(location.pathname) || !document.getElementById('resource-tree')) {
    alert('L2GM: открой калькулятор крафта и нажми закладку там.');
    return;
  }

  panel('загружаю цены…');

  let resources, catalog;
  try {
    const [prices, cat] = await Promise.all([
      fetch(API, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('цены L2GM: HTTP ' + r.status); return r.json(); }),
      fetch('/craft/catalog', { credentials: 'same-origin', cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('каталог рецептов: HTTP ' + r.status); return r.json(); }),
    ]);
    resources = prices.resources || [];
    catalog = cat.rows || [];
  } catch (e) {
    panel('не удалось загрузить: ' + e.message);
    return;
  }

  // Все предметы каталога (изделия и материалы): id → имя
  const items = new Map();
  for (const recipe of catalog) {
    if (recipe.output?.id) items.set(String(recipe.output.id), recipe.output.name);
    for (const m of recipe.materials || []) items.set(String(m.id), m.name);
  }

  // slug → id предмета в каталоге: сначала по имени, потом по стандартному ID
  const idByName = new Map([...items].map(([id, name]) => [norm(name), id]));
  const targets = resources.map(r => {
    let id = idByName.get(norm(r.name));
    if (!id && ITEM_IDS[r.slug] && items.has(String(ITEM_IDS[r.slug]))) id = String(ITEM_IDS[r.slug]);
    return id ? { id, r } : null;
  }).filter(Boolean);

  const latest = resources.map(r => r.sell_updated_at || r.buy_updated_at || r.updated_at).filter(Boolean).sort().pop();
  const $ = id => document.getElementById(id);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // Текущий выбор игрока: предмет, рецепт, клики — чтобы не потерять его
  function currentSelection() {
    const recipeId = $('recipe-select')?.value;
    if (!recipeId || $('recipe-card')?.hidden) return null;
    const recipe = catalog.find(row => String(row.id) === recipeId);
    if (!recipe?.output?.id) return null;
    return {
      selectedId: String(recipe.output.id), recipeId,
      quantity: Math.max(1, Math.trunc(Number($('target-quantity')?.value) || 1)),
      name: $('scenario-name')?.value || recipe.output.name || 'L2GM',
    };
  }

  // Прогоняем данные через штатный «Импорт сценария»: он обновляет состояние
  // калькулятора без перезагрузки и сохраняет выбранный предмет. Временный
  // сценарий потом удаляем из списка сохранённых.
  async function importScenario(scenario) {
    const input = $('scenario-file');
    if (!input || typeof DataTransfer === 'undefined') return false;
    const dt = new DataTransfer();
    dt.items.add(new File([JSON.stringify(scenario)], 'l2gm-prices.json', { type: 'application/json' }));
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    for (let i = 0; i < 40; i++) {
      await wait(50);
      const status = $('scenario-status')?.textContent || '';
      if (status.startsWith('Импортировано')) {
        if ($('scenario-select')?.value) $('delete-scenario')?.click();
        $('scenario-status').textContent = 'Цены L2GM подставлены.';
        return true;
      }
      if (status.startsWith('Не удалось импортировать')) return false;
    }
    return false;
  }

  let busy = false;

  async function apply(modeKey) {
    if (busy) return;
    busy = true;
    const mode = MODES[modeKey];
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch { /* пусто */ }
    const values = saved.values && typeof saved.values === 'object' ? saved.values : {};
    const modes = saved.modes && typeof saved.modes === 'object' ? saved.modes : {};
    const crafterFee = Number(saved.crafterFee ?? $('crafter-fee')?.value) || 0;

    let count = 0;
    for (const { id, r } of targets) {
      const price = mode.pick(r);
      if (price === null || price === undefined) continue;
      values[id] = { ...(values[id] || {}), price: Number(price) };
      count++;
    }

    const sel = currentSelection();
    let live = false;
    if (sel) live = await importScenario({ version: 1, ...sel, crafterFee, values, modes });

    if (!live) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, values, modes, crafterFee }));
      } catch {
        panel('браузер не даёт сохранить данные калькулятора (приватный режим?).');
        busy = false;
        return;
      }
    }

    const other = modeKey === 'sell' ? 'buy' : 'sell';
    const note = live ? ''
      : sel ? '<br><span style="color:#f0a">не получилось подставить на лету — страница обновится, предмет выбери заново</span>'
      : '<br><span style="color:#999">страница обновится через пару секунд…</span>';
    const el = panel(
      'подставлено <b>' + count + '</b> цен (' + mode.label + ')' +
      (latest ? '<br><span style="color:#999">цены от ' + latest.slice(0, 16) + ' МСК</span>' : '') + note + '<br>' +
      (live ? '<button data-switch style="' + btn + 'background:#2a303b;color:#e8e8e8;border:1px solid #444">Взять ' + MODES[other].label + '</button>' : '')
    );
    const sw = el.querySelector('[data-switch]');
    if (sw) sw.onclick = () => apply(other);
    busy = false;
    if (!live) setTimeout(() => location.reload(), RELOAD_DELAY);
  }

  apply('sell');
})();
