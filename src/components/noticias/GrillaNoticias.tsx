import type { Noticia } from '@/data/types'
import { NoticiaCard } from './NoticiaCard'
import { GrupoAparicion, ItemAparicion } from '@/components/ui/animaciones'

/**
 * Rejilla responsiva de notas con entrada escalonada al hacer scroll.
 * Patrón compartido por la portada y por todas las secciones.
 */
export function GrillaNoticias({ noticias }: { noticias: Noticia[] }) {
  return (
    <GrupoAparicion className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {noticias.map((n) => (
        <ItemAparicion key={n.id}>
          <NoticiaCard noticia={n} />
        </ItemAparicion>
      ))}
    </GrupoAparicion>
  )
}
