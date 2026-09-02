import { Link, useParams } from 'react-router-dom'
import type { EstadisticaPartido, Partido } from '@/data/types'
import { usePartido } from '@/hooks/usePartido'
import { fechaLarga, horaCorta } from '@/data/utils/tiempoRelativo'
import { AnimatedCounter } from '@/components/deportes/AnimatedCounter'
import { JugadaPorJugada } from '@/components/deportes/JugadaPorJugada'
import { EncabezadoBloque } from '@/components/ui/EncabezadoBloque'
import { Skeleton } from '@/components/ui/Skeleton'

function estadoTexto(p: Partido): string {
  switch (p.estado) {
    case 'en-vivo':
      return `EN VIVO · ${p.minuto}'`
    case 'medio-tiempo':
      return 'MEDIO TIEMPO'
    case 'finalizado':
      return 'FINALIZADO'
    default:
      return `${fechaLarga(p.inicioISO)} · ${horaCorta(p.inicioISO)}`
  }
}

function BarraEstadistica({ e }: { e: EstadisticaPartido }) {
  const total = e.local + e.visitante || 1
  const pctLocal = Math.round((e.local / total) * 100)
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-bold tabular-nums">
          {e.local}
          {e.esPorcentaje ? '%' : ''}
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">{e.etiqueta}</span>
        <span className="font-bold tabular-nums">
          {e.visitante}
          {e.esPorcentaje ? '%' : ''}
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-full bg-neutral-900 transition-all duration-300 dark:bg-white"
          style={{ width: `${pctLocal}%` }}
        />
        <div className="h-full flex-1 bg-neutral-400 dark:bg-neutral-600" />
      </div>
    </div>
  )
}

function Alineacion({ titulo, jugadores }: { titulo: string; jugadores: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">{titulo}</h3>
      <ol className="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-300">
        {jugadores.map((j, i) => (
          <li key={j} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-right text-xs tabular-nums text-neutral-400">
              {i + 1}
            </span>
            {j}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function PartidoDetalle() {
  const { id } = useParams<{ id: string }>()
  const { partido, cargando } = usePartido(id)

  if (cargando) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="mt-8 h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!partido) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Partido no encontrado</h1>
        <Link to="/seccion/deportes" className="mt-4 inline-block text-acento-600 dark:text-acento-400">
          ← Volver a Deportes
        </Link>
      </div>
    )
  }

  const enVivo = partido.estado === 'en-vivo' || partido.estado === 'medio-tiempo'
  const programado = partido.estado === 'programado'
  const tieneAlineacion = partido.alineacionLocal.length > 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/seccion/deportes"
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-acento-600 dark:text-neutral-400 dark:hover:text-acento-400"
      >
        ← Deportes
      </Link>

      {/* Marcador */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          {partido.competicion} · {partido.sede}
        </p>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <img src={partido.local.escudoUrl} alt="" aria-hidden="true" className="h-12 w-12 rounded-full" />
            <span className="text-sm font-semibold">{partido.local.nombre}</span>
          </div>
          <div className="flex flex-col items-center">
            {programado ? (
              <span className="text-3xl font-bold text-neutral-400">vs</span>
            ) : (
              <div className="flex items-center gap-3 text-4xl font-bold">
                <AnimatedCounter valor={partido.marcadorLocal} />
                <span className="text-neutral-300 dark:text-neutral-600">-</span>
                <AnimatedCounter valor={partido.marcadorVisitante} />
              </div>
            )}
            <span
              className={[
                'mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold',
                enVivo
                  ? 'bg-acento-500/10 text-acento-600 dark:text-acento-400'
                  : 'text-neutral-400 dark:text-neutral-500',
              ].join(' ')}
            >
              {enVivo && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-900 dark:bg-white" aria-hidden="true" />
              )}
              {estadoTexto(partido)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <img src={partido.visitante.escudoUrl} alt="" aria-hidden="true" className="h-12 w-12 rounded-full" />
            <span className="text-sm font-semibold">{partido.visitante.nombre}</span>
          </div>
        </div>
      </div>

      {programado ? (
        <p className="mt-8 text-center text-neutral-500 dark:text-neutral-400">
          Este encuentro aún no comienza. La narración jugada por jugada estará
          disponible al arrancar el partido.
        </p>
      ) : (
        <>
          {/* Estadísticas */}
          {partido.estadisticas.length > 0 && (
            <section className="mt-10">
              <EncabezadoBloque titulo="Estadísticas" />
              <div className="flex flex-col gap-4">
                {partido.estadisticas.map((e) => (
                  <BarraEstadistica key={e.etiqueta} e={e} />
                ))}
              </div>
            </section>
          )}

          {/* Alineaciones */}
          {tieneAlineacion && (
            <section className="mt-10">
              <EncabezadoBloque titulo="Alineaciones" />
              <div className="grid grid-cols-2 gap-6">
                <Alineacion titulo={partido.local.nombre} jugadores={partido.alineacionLocal} />
                <Alineacion titulo={partido.visitante.nombre} jugadores={partido.alineacionVisitante} />
              </div>
            </section>
          )}

          {/* Narración jugada por jugada */}
          <section className="mt-10">
            <EncabezadoBloque titulo="Jugada por jugada" />
            <JugadaPorJugada jugadas={partido.narracion} />
          </section>
        </>
      )}
    </div>
  )
}
