import { useState } from 'react'

/**
 * Compartir un artículo (una de las cuatro acciones del sitio). Usa la API
 * nativa `navigator.share` cuando existe; si no, copia el enlace al portapapeles
 * y muestra confirmación breve.
 */
export function CompartirBoton({
  titulo,
  className = '',
}: {
  titulo: string
  className?: string
}) {
  const [copiado, setCopiado] = useState(false)

  async function compartir() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url })
      } catch {
        // El usuario canceló el diálogo nativo: no es un error que reportar.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sin permisos de portapapeles; se ignora silenciosamente.
    }
  }

  return (
    <button
      type="button"
      onClick={compartir}
      className={`inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-acento-500 hover:text-acento-600 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-acento-500 dark:hover:text-acento-400 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" />
      </svg>
      {copiado ? '¡Enlace copiado!' : 'Compartir'}
    </button>
  )
}
