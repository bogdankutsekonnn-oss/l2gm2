// Трекинг кликов по серверам и построение исходящих ссылок.
//
// Переход идёт напрямую на сайт сервера (без редиректа через /api/out.php),
// а факт клика отправляется в фоне через navigator.sendBeacon — браузер
// гарантирует доставку даже после ухода со страницы, переход не замедляется.

// Нормализация URL и ключ сервера — тот же формат, что в
// scripts/sync-from-db.js и scripts/update-servers.js.
export function normalizeServerUrl(url) {
  if (!url) return ''
  return String(url)
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')
}

export function serverKey(server) {
  return `${normalizeServerUrl(server.url)}|${server.chronicle}|${server.category ?? server.rate}`
}

// Прямая ссылка на сервер с UTM-метками (раньше их дописывал out.php).
export function buildServerHref(server) {
  if (!server?.url) return ''
  const separator = server.url.includes('?') ? '&' : '?'
  return `${server.url}${separator}utm_source=l2gm&utm_medium=listing&utm_campaign=${encodeURIComponent(server.name || 'unknown')}`
}

export function trackServerClick(server) {
  if (typeof window === 'undefined' || !server?.url) return
  const payload = JSON.stringify({
    key: serverKey(server),
    name: server.name || '',
    url: server.url,
  })
  try {
    const blob = new Blob([payload], { type: 'application/json' })
    if (navigator.sendBeacon && navigator.sendBeacon('/api/click.php', blob)) return
  } catch {
    // sendBeacon недоступен — уходим в fallback
  }
  // Fallback: fetch с keepalive тоже переживает уход со страницы
  fetch('/api/click.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {})
}
