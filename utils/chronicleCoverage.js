// Пустые хроники: у редких хроник (Freya, Lindvior, Master Class…) серверов
// месяцами нет. Пустой листинг в выдаче — плохие поведенческие и «малоценная
// страница» для Яндекса, поэтому на время пустоты страница уходит в noindex и
// из sitemap, вместо списка показывает старты соседних хроник, а в меню
// фильтров приглушается. Появился сервер — ближайший ежедневный ребилд
// вернёт всё само.
//
// Пустоту считаем по data/servers.json (то же 30-дневное окно, что в
// useFilters.getServers), а не по API: так меню, мета robots и sitemap
// совпадают между собой и между SSR и гидрацией.

// Куда отправлять игрока с пустой хроники — ближайшие по духу хроники.
export const CHRONICLE_NEIGHBORS = {
  c1: ['c4', 'interlude'],
  c4: ['interlude', 'c1'],
  'gracia-final': ['high-five', 'interlude'],
  epilogue: ['high-five', 'interlude'],
  freya: ['high-five', 'epilogue'],
  'high-five-plus': ['high-five', 'interlude-plus'],
  'interlude-plus': ['interlude', 'high-five-plus'],
  classic: ['interlude', 'c4'],
  god: ['essence', 'high-five'],
  lindvior: ['god', 'essence'],
  helios: ['god', 'essence'],
  'grand-crusade': ['essence', 'god'],
  'master-class': ['essence', 'god'],
  crusade: ['essence', 'god'],
  essence: ['interlude', 'high-five'],
  interlude: ['interlude-plus', 'high-five'],
  'high-five': ['high-five-plus', 'interlude'],
}

const windowStart = (nowMs) => {
  const d = new Date(nowMs)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - 30)
  return d
}

// Имена хроник (как в servers.json: «High Five», «Interlude+»), у которых есть
// хотя бы один сервер в окне листингов.
export function activeChronicleNames(servers, nowMs = Date.now()) {
  const from = windowStart(nowMs)
  const names = new Set()
  for (const s of servers) {
    if (new Date(s.startDate) >= from) names.add(s.chronicle)
  }
  return names
}

export function isChronicleEmpty(chronicle, servers, nowMs = Date.now()) {
  if (!chronicle) return false
  return !activeChronicleNames(servers, nowMs).has(chronicle.name)
}
