import { Link } from 'react-router-dom'
import type { Noticia } from '@/data/types'
import { tiempoRelativo } from '@/data/utils/tiempoRelativo'
import { nombreSeccion } from '@/data/noticias'
import { COLOR_SECCION } from '@/lib/constantes'

/**
 * Lista compacta de titulares (sin imagen), numerada, para columnas laterales.
 * Aporta densidad informativa tipo diario.
 */
export function ListaCompacta({ noticias }: { noticias: Noticia[] }) {
  return (
    <ol className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
      {noticias.map((n, i) => (
        <li key={n.id}>
          <Link to={`/articulo/${n.id}`} className="group flex gap-3 py-3">
            <span className="font-serif text-lg font-bold leading-none text-neutral-300 dark:text-neutral-600">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1">
              <span className={`text-xs font-semibold uppercase tracking-wide ${COLOR_SECCION[n.seccion]}`}>
                {nombreSeccion(n.seccion)}
              </span>
              <h3 className="text-sm font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-acento-600 dark:text-neutral-100 dark:group-hover:text-acento-400">
                {n.titulo}
              </h3>
              <time
                dateTime={n.fechaISO}
                className="text-xs text-neutral-400 dark:text-neutral-500"
              >
                {tiempoRelativo(n.fechaISO)}
              </time>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  )
}
