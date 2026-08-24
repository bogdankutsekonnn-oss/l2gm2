/**
 * L2GM — общие расчёты для админок цен и торговцев.
 * Подключается в admin-prices.html и admin-merchants.html.
 *
 * Термины:
 *   buy_*  — по какой цене ресурс СКУПАЕТСЯ (сколько мы платим)
 *   sell_* — по какой цене ресурс ПРОДАЁТСЯ (сколько мы получаем)
 *   Флип   = купил у игроков → продал игрокам
 *   Крафт  = скупил ингредиенты → скрафтил → продал
 */
window.L2Calc = (function () {

  function fmt(n) {
    if (n === null || n === undefined) return '—';
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function fmtSigned(n) {
    if (n === null || n === undefined) return '—';
    return (n >= 0 ? '+' : '') + fmt(n);
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /**
   * Рекурсивная себестоимость крафта на 1 шт с учётом yield_qty.
   * По каждому ингредиенту берём минимум из «купить» и «скрафтить самому».
   * null — если хоть у одного ингредиента нет цены (или цикл в рецептах).
   */
  function computeCost(resource, bySlug, visited) {
    visited = visited || new Set();
    if (!resource) return null;
    if (!resource.recipe || !resource.recipe.length) {
      return resource.buy_avg !== null && resource.buy_avg !== undefined ? resource.buy_avg : null;
    }
    if (visited.has(resource.slug)) return null;
    visited.add(resource.slug);

    let total = 0;
    for (const ing of resource.recipe) {
      const ingRes = bySlug[ing.slug];
      if (!ingRes) return null;
      let unitCost = ingRes.buy_avg;
      if (ingRes.recipe && ingRes.recipe.length) {
        const craftCost = computeCost(ingRes, bySlug, new Set(visited));
        if (craftCost !== null) {
          unitCost = (unitCost === null || unitCost === undefined) ? craftCost : Math.min(unitCost, craftCost);
        }
      }
      if (unitCost === null || unitCost === undefined) return null;
      total += unitCost * ing.qty;
    }
    return Math.round(total / (resource.yield_qty || 1));
  }

  /** Список ингредиентов без цены — чтобы объяснить, почему себестоимость не посчиталась. */
  function findMissingIngredients(resource, bySlug, missing, visited) {
    missing = missing || [];
    visited = visited || new Set();
    if (!resource || visited.has(resource.slug)) return missing;
    visited.add(resource.slug);
    if (!resource.recipe) return missing;
    for (const ing of resource.recipe) {
      const ingRes = bySlug[ing.slug];
      if (!ingRes) { missing.push(ing.slug); continue; }
      if (ingRes.buy_avg !== null && ingRes.buy_avg !== undefined) continue;
      if (ingRes.recipe && ingRes.recipe.length) {
        findMissingIngredients(ingRes, bySlug, missing, visited);
      } else if (!missing.includes(ingRes.name)) {
        missing.push(ingRes.name);
      }
    }
    return missing;
  }

  /**
   * Флип: купить по buy_avg → продать по sell_avg.
   * guaranteed — худший случай: скупали по максимуму, продали по минимуму.
   */
  function flipMetrics(r) {
    const buy  = num(r.buy_avg);
    const sell = num(r.sell_avg);
    const profit = (buy !== null && sell !== null) ? sell - buy : null;
    const buyMax  = num(r.buy_max)  !== null ? num(r.buy_max)  : buy;
    const sellMin = num(r.sell_min) !== null ? num(r.sell_min) : sell;
    const guaranteed = (buyMax !== null && sellMin !== null) ? sellMin - buyMax : null;
    const roi = (profit !== null && buy) ? profit / buy * 100 : null;
    return {buy, sell, profit, guaranteed, roi};
  }

  /**
   * Крафт: скупить ингредиенты → продать готовое по sell_avg.
   * cheaperToBuy — готовое на рынке дешевле, чем крафтить: крафт смысла не имеет,
   * ресурс надо ставить в скупку, а не собирать.
   */
  function craftMetrics(r, bySlug) {
    if (!r.recipe || !r.recipe.length) return null;
    const cost = computeCost(r, bySlug);
    const sell = num(r.sell_avg);
    const profit = (cost !== null && sell !== null) ? sell - cost : null;
    const roi = (profit !== null && cost) ? profit / cost * 100 : null;
    const buy = num(r.buy_avg);
    const cheaperToBuy = (cost !== null && buy !== null && buy < cost);
    return {cost, sell, profit, roi, cheaperToBuy};
  }

  /** Топ ресурсов по флипу. sortBy: 'roi' | 'profit'. */
  function topFlip(resources, opts) {
    opts = opts || {};
    const rows = [];
    for (const r of resources) {
      const m = flipMetrics(r);
      if (m.profit === null) continue;
      rows.push({resource: r, ...m});
    }
    return sortRows(rows, opts.sortBy).slice(0, opts.limit || rows.length);
  }

  /** Топ ресурсов по крафту. sortBy: 'roi' | 'profit'. */
  function topCraft(resources, bySlug, opts) {
    opts = opts || {};
    const rows = [];
    for (const r of resources) {
      const m = craftMetrics(r, bySlug);
      if (!m || m.profit === null) continue;
      rows.push({resource: r, ...m});
    }
    return sortRows(rows, opts.sortBy).slice(0, opts.limit || rows.length);
  }

  function sortRows(rows, sortBy) {
    const key = sortBy === 'profit' ? 'profit' : 'roi';
    return rows.sort((a, b) => {
      const av = a[key], bv = b[key];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return bv - av;
    });
  }

  function num(v) {
    return (v === null || v === undefined || v === '') ? null : Number(v);
  }

  function recipeToText(r, bySlug) {
    if (!r.recipe) return '';
    return r.recipe.map(i => `${(bySlug[i.slug] || {}).name || i.slug}×${i.qty}`).join(' + ');
  }

  return {
    fmt, fmtSigned, escapeHtml,
    computeCost, findMissingIngredients,
    flipMetrics, craftMetrics,
    topFlip, topCraft, recipeToText,
  };
})();
