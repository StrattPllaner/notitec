import { Link } from 'react-router-dom'
import type { Partido } from '@/data/types'
import { AnimatedCounter } from './AnimatedCounter'

/** Texto de estado del partido para la esquina de la tarjeta. */
function estadoTexto(p: Partido): string {
  switch (p.estado) {
    case 'en-vivo':
      return `${p.minuto}'`
    case 'medio-tiempo':
      return 'Medio tiempo'
    case 'finalizado':
      return 'Final'
    default:
      return 'Por comenzar'
  }
}

function FilaEquipo({
  nombre,
  abreviatura,
  escudoUrl,
  goles,
  ganando,
}: {
  nombre: string
  abreviatura: string
  escudoUrl: string
  goles: number
  ganando: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <img src={escudoUrl} alt="" aria-hidden="true" className="h-7 w-7 rounded-full" />
        <span
          className={`truncate text-sm ${ganando ? 'font-bold text-neutral-900 dark:text-white' : 'font-medium text-neutral-600 dark:text-neutral-300'}`}
        >
          <span className="hidden sm:inline">{nombre}</span>
          <span className="sm:hidden">{abreviatura}</span>
        </span>
      </div>
      <AnimatedCounter
        valor={goles}
        className={`text-xl font-bold ${ganando ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}
      />
    </div>
  )
}

/** Tarjeta de marcador en vivo. Toda la tarjeta enlaza al detalle del partido. */
export function MarcadorEnVivoCard({ partido }: { partido: Partido }) {
  const enVivo = partido.estado === 'en-vivo' || partido.estado === 'medio-tiempo'
  const localGana = partido.marcadorLocal > partido.marcadorVisitante
  const visitanteGana = partido.marcadorVisitante > partido.marcadorLocal

  return (
    <Link
      to={`/partido/${partido.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-acento-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-acento-700"
    >
      <div className="flex items-center justify-between">
        <span className="truncate text-xs font-medium text-neutral-400 dark:text-neutral-500">
          {partido.competicion}
        </span>
        <span
          className={[
            'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold',
            enVivo
              ? 'bg-acento-500/10 text-acento-600 dark:text-acento-400'
              : 'text-neutral-400 dark:text-neutral-500',
          ].join(' ')}
        >
          {enVivo && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acento-500" aria-hidden="true" />
          )}
          {estadoTexto(partido)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <FilaEquipo
          nombre={partido.local.nombre}
          abreviatura={partido.local.abreviatura}
          escudoUrl={partido.local.escudoUrl}
          goles={partido.marcadorLocal}
          ganando={localGana}
        />
        <FilaEquipo
          nombre={partido.visitante.nombre}
          abreviatura={partido.visitante.abreviatura}
          escudoUrl={partido.visitante.escudoUrl}
          goles={partido.marcadorVisitante}
          ganando={visitanteGana}
        />
      </div>

      <span className="mt-1 text-xs font-medium text-acento-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-acento-400">
        Ver narración →
      </span>
    </Link>
  )
}
