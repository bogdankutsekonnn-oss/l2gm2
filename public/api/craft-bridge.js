/**
 * L2GM → калькулятор крафта Lu4 (access.112312312.xyz/craft).
 * Подгружается закладкой (букмарклетом) прямо на странице калькулятора,
 * берёт наши цены из /api/prices.php и проставляет их в поля «цена».
 * Запас (owned) и выбранные режимы игрока не трогаем.
 */
(async () => {
  const API = 'https://l2gm.com/api/prices.php';
  const STORAGE_KEY = 'lu4-craft-calculator-values-v1';
  const PANEL_ID = 'l2gm-bridge-panel';

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
    'blacksmiths-frame': 1892, 'oriharukon': 1893, 'crafted-leather': 1894, 'metallic-thread': 1895,
    'mold-glue': 4039, 'mold-lubricant': 4040, 'mold-hardener': 4041, 'enria': 4042, 'asofe': 4043, 'thons': 4044,
    'maestro-holder': 4045, 'maestro-anvil-lock': 4046, 'craftsman-mold': 4047, 'maestro-mold': 4048,
    'metal-hardener': 5220, 'metallic-fiber': 5549, 'durable-metal-plate': 5550,
    'warsmiths-mold': 5552, 'warsmiths-holder': 5554,
    'enchant-weapon-d': 955, 'enchant-armor-d': 956, 'enchant-weapon-c': 951, 'enchant-armor-c': 952,
    'enchant-weapon-b': 947, 'enchant-armor-b': 948, 'enchant-weapon-a': 729, 'enchant-armor-a': 730,
  };

  const MODES = {
    sell: { label: 'цены в магазинах продажи', pick: r => r.sell_avg ?? r.sell_min ?? r.buy_avg },
    buy:  { label: 'цены скупки', pick: r => r.buy_avg ?? r.buy_max ?? r.sell_avg },
  };

  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9а-яё]/g, '');

  function panel(html) {
    let el = document.getElementById(PANEL_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = PANEL_ID;
      el.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:99999;max-width:360px;padding:14px 16px;' +
        'background:#1b1f27;color:#e8e8e8;border:1px solid #d4a64a;border-radius:10px;font:14px/1.45 system-ui,sans-serif;' +
        'box-shadow:0 8px 30px rgba(0,0,0,.5)';
      document.body.append(el);
    }
    el.innerHTML = html + '<button data-close style="position:absolute;top:6px;right:8px;background:none;border:0;color:#999;font-size:18px;cursor:pointer">×</button>';
    el.querySelector('[data-close]').onclick = () => el.remove();
    return el;
  }

  if (!/\/craft\/?$/.test(location.pathname) || !document.getElementById('resource-tree')) {
    alert('L2GM: открой калькулятор крафта и нажми закладку там.');
    return;
  }

  panel('<b style="color:#d4a64a">L2GM</b> · загружаю цены…');

  let resources;
  try {
    const res = await fetch(API, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    resources = (await res.json()).resources || [];
  } catch (e) {
    panel('<b style="color:#d4a64a">L2GM</b> · не удалось получить цены: ' + e.message);
    return;
  }

  // Каталог калькулятора: top-level const state доступен из глобальной области
  const live = typeof state !== 'undefined' && state && state.byId instanceof Map ? state : null;
  if (live && !live.byId.size) {
    panel('<b style="color:#d4a64a">L2GM</b> · каталог рецептов ещё не загрузился, нажми закладку через пару секунд.');
    return;
  }

  // slug → id предмета в каталоге: сначала по имени, потом по стандартному ID
  const idByName = new Map();
  if (live) for (const [id, item] of live.byId) idByName.set(norm(item.name), id);
  const targets = resources.map(r => {
    let id = idByName.get(norm(r.name));
    if (!id && ITEM_IDS[r.slug] && (!live || live.byId.has(String(ITEM_IDS[r.slug])))) id = String(ITEM_IDS[r.slug]);
    return id ? { id, r } : null;
  }).filter(Boolean);

  const latest = resources.map(r => r.sell_updated_at || r.buy_updated_at || r.updated_at).filter(Boolean).sort().pop();

  function apply(modeKey) {
    const mode = MODES[modeKey];
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { /* пусто */ }
    const values = live ? live.values : (saved.values && typeof saved.values === 'object' ? saved.values : {});

    let count = 0;
    for (const { id, r } of targets) {
      const price = mode.pick(r);
      if (price === null || price === undefined) continue;
      values[id] = { ...(values[id] || {}), price: Number(price) };
      count++;
    }

    if (live) {
      live.values = values;
      try { saveValues(); } catch { /* ниже сохраним сами */ }
      try { if (typeof renderPlan === 'function') renderPlan(); } catch { /* перерисуется при следующем действии */ }
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, values, modes: live ? live.modes : (saved.modes || {}), crafterFee: live ? live.crafterFee : (saved.crafterFee || 0) }));
    } catch { /* хранилище недоступно */ }

    const other = modeKey === 'sell' ? 'buy' : 'sell';
    const el = panel(
      '<b style="color:#d4a64a">L2GM</b> · подставлено <b>' + count + '</b> цен (' + mode.label + ')' +
      (latest ? '<br><span style="color:#999">обновлено ' + latest.slice(0, 16) + ' МСК</span>' : '') +
      '<br><button data-switch style="margin-top:8px;padding:4px 10px;background:#2a303b;color:#e8e8e8;border:1px solid #444;border-radius:6px;cursor:pointer">Взять ' + MODES[other].label + '</button>' +
      (live ? '' : ' <button data-reload style="margin-top:8px;padding:4px 10px;background:#d4a64a;color:#111;border:0;border-radius:6px;cursor:pointer">Обновить страницу</button>')
    );
    el.querySelector('[data-switch]').onclick = () => apply(other);
    const reload = el.querySelector('[data-reload]');
    if (reload) reload.onclick = () => location.reload();
  }

  apply('sell');
})();
