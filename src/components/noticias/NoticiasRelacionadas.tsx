import type { Noticia } from '@/data/types'
import { NoticiaCard } from './NoticiaCard'

/**
 * Tres notas relacionadas al final del artículo. Sin animación de entrada: la
 * vista de artículo se mantiene calmada para no competir con la lectura.
 */
export function NoticiasRelacionadas({ noticias }: { noticias: Noticia[] }) {
  if (noticias.length === 0) return null
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
      {noticias.map((n) => (
        <NoticiaCard key={n.id} noticia={n} />
      ))}
    </div>
  )
}
