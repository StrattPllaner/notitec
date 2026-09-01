import { Link } from 'react-router-dom'
import type { Noticia } from '@/data/types'
import { tiempoRelativo } from '@/data/utils/tiempoRelativo'
import { EtiquetaSeccion } from '@/components/ui/EtiquetaSeccion'

/**
 * Tarjeta de nota para las rejillas. Al pasar el cursor, la tarjeta se eleva
 * levemente y la imagen escala al 103%. Toda la tarjeta enlaza al artículo.
 */
export function NoticiaCard({ noticia }: { noticia: Noticia }) {
  return (
    <Link
      to={`/articulo/${noticia.id}`}
      className="group flex flex-col overflow-hidden rounded-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <img
          src={noticia.imagenUrl}
          alt={noticia.imagenAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 pt-3">
        <div className="flex items-center gap-2">
          <EtiquetaSeccion seccion={noticia.seccion} />
        </div>
        <h3 className="text-base font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-acento-600 dark:text-neutral-100 dark:group-hover:text-acento-400">
          {noticia.titulo}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          {noticia.entradilla}
        </p>
        <time
          dateTime={noticia.fechaISO}
          className="mt-auto pt-1 text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
        >
          {tiempoRelativo(noticia.fechaISO)}
        </time>
      </div>
    </Link>
  )
}
