// Convierte un enlace de transmisión (el que pega el editor) en una URL lista
// para incrustar en un <iframe>. Soporta YouTube y Twitch; para cualquier otro
// proveedor, usa el enlace tal cual (útil si ya es una URL de "embed").

export function urlEmbebible(
  url: string | undefined,
  hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost',
): string | null {
  if (!url) return null
  const u = url.trim()
  if (!u) return null

  try {
    const parsed = new URL(u)
    const host = parsed.hostname.replace(/^www\./, '')

    // YouTube
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = parsed.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      const partes = parsed.pathname.split('/').filter(Boolean)
      // /live/ID o /embed/ID
      if ((partes[0] === 'live' || partes[0] === 'embed') && partes[1]) {
        return `https://www.youtube.com/embed/${partes[1]}`
      }
    }
    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    // Twitch (requiere el parámetro parent = dominio donde se incrusta)
    if (host === 'twitch.tv') {
      const canal = parsed.pathname.split('/').filter(Boolean)[0]
      if (canal) return `https://player.twitch.tv/?channel=${canal}&parent=${hostname}`
    }
    if (host === 'player.twitch.tv') {
      parsed.searchParams.set('parent', hostname)
      return parsed.toString()
    }

    // Otro proveedor: se asume que ya es incrustable.
    return u
  } catch {
    return null
  }
}
