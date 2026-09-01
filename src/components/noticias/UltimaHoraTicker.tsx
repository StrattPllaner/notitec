import { Link } from 'react-router-dom'
import type { UltimaHora } from '@/data/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Franja de última hora: titulares breves que se desplazan horizontalmente.
 * Vive fuera del área de lectura, por lo que puede animarse en bucle. Con
 * prefers-reduced-motion se convierte en una fila estática desplazable.
 */
export function UltimaHoraTicker({ titulares }: { titulares: UltimaHora[] }) {
  const reduce = useReducedMotion()
  if (titulares.length === 0) return null

  return (
    <div className="flex items-stretch overflow-hidden border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      <span className="z-10 flex shrink-0 items-center gap-2 bg-acento-600 px-4 text-xs font-bold uppercase tracking-widest text-white">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden="true" />
        Última hora
      </span>

      {reduce ? (
        <div className="flex gap-8 overflow-x-auto whitespace-nowrap px-4 py-2.5">
          {titulares.map((t) => (
            <TituloTicker key={t.id} titular={t} />
          ))}
        </div>
      ) : (
        <div className="group relative flex-1 overflow-hidden py-2.5">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap px-4 group-hover:[animation-play-state:paused]">
            {/* Se duplica la lista para un bucle continuo y sin cortes. */}
            {[...titulares, ...titulares].map((t, i) => (
              <TituloTicker key={`${t.id}-${i}`} titular={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TituloTicker({ titular }: { titular: UltimaHora }) {
  const contenido = (
    <span className="text-sm font-medium text-neutral-700 transition-colors hover:text-acento-600 dark:text-neutral-200 dark:hover:text-acento-400">
      <span className="mr-2 text-acento-500" aria-hidden="true">
        ●
      </span>
      {titular.texto}
    </span>
  )
  return titular.noticiaId ? (
    <Link to={`/articulo/${titular.noticiaId}`}>{contenido}</Link>
  ) : (
    contenido
  )
}
