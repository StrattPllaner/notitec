import { useEffect, useState } from 'react'
import type { Deporte, Partido, Torneo } from '@/data/types'
import {
  agruparProximos,
  filtrarEnVivo,
  filtrarResultados,
  getCronicasDeportivas,
  getDeportesDisponibles,
  getTorneosDisponibles,
} from '@/data/deportes'
import { useAsync } from '@/hooks/useAsync'
import { usePartidos } from '@/hooks/usePartidos'
import { MarcadorEnVivoCard } from '@/components/deportes/MarcadorEnVivoCard'
import { CalendarioPartidos } from '@/components/deportes/CalendarioPartidos'
import { NoticiaCard } from '@/components/noticias/NoticiaCard'
import { EncabezadoBloque } from '@/components/ui/EncabezadoBloque'
import { SkeletonTarjeta } from '@/components/ui/Skeleton'
import { GrupoAparicion, ItemAparicion } from '@/components/ui/animaciones'

/** Botón de pestaña (deporte o torneo). Área táctil cómoda. */
function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={[
        'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
        activo
          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
          : 'border border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

/** Rejilla de tarjetas de marcador (en vivo o resultados). */
function GrillaMarcadores({ partidos }: { partidos: Partido[] }) {
  return (
    <GrupoAparicion className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {partidos.map((p) => (
        <ItemAparicion key={p.id}>
          <MarcadorEnVivoCard partido={p} />
        </ItemAparicion>
      ))}
    </GrupoAparicion>
  )
}

export default function Deportes() {
  const partidos = usePartidos()
  const deportes = getDeportesDisponibles(partidos)

  const [deporte, setDeporte] = useState<Deporte>('futbol')
  const [torneo, setTorneo] = useState<Torneo>('representativo')

  const torneos = getTorneosDisponibles(partidos, deporte)

  // Al cambiar de deporte, asegura que el torneo seleccionado exista.
  useEffect(() => {
    const disponibles = getTorneosDisponibles(partidos, deporte)
    if (disponibles.length > 0 && !disponibles.some((t) => t.slug === torneo)) {
      setTorneo(disponibles[0].slug)
    }
  }, [partidos, deporte, torneo])

  const filtro = { deporte, torneo }
  const enVivo = filtrarEnVivo(partidos, filtro)
  const proximos = agruparProximos(partidos, filtro)
  const resultados = filtrarResultados(partidos, filtro)
  const cronicas = useAsync(() => getCronicasDeportivas(4), [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          Sección
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Deportes
        </h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Marcadores, calendario y resultados de los Borregos del Campus Cuernavaca.
        </p>
      </header>

      {/* Pestañas de deporte */}
      <div className="mb-3 flex flex-wrap gap-2">
        {deportes.map((d) => (
          <Chip key={d.slug} activo={d.slug === deporte} onClick={() => setDeporte(d.slug)}>
            {d.nombre}
          </Chip>
        ))}
      </div>

      {/* Pestañas de torneo (dependen del deporte) */}
      {torneos.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
          {torneos.map((t) => (
            <Chip key={t.slug} activo={t.slug === torneo} onClick={() => setTorneo(t.slug)}>
              {t.nombre}
            </Chip>
          ))}
        </div>
      )}

      {/* En vivo */}
      {enVivo.length > 0 && (
        <section className="mb-12" aria-label="Marcadores en vivo">
          <EncabezadoBloque titulo="En vivo" />
          <GrillaMarcadores partidos={enVivo} />
        </section>
      )}

      {/* Próximos partidos */}
      <section className="mb-12" aria-label="Próximos partidos">
        <EncabezadoBloque titulo="Próximos partidos" />
        <CalendarioPartidos grupos={proximos} />
      </section>

      {/* Resultados */}
      <section className="mb-12" aria-label="Resultados recientes">
        <EncabezadoBloque titulo="Resultados" />
        {resultados.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Aún no hay resultados en este torneo.
          </p>
        ) : (
          <GrillaMarcadores partidos={resultados} />
        )}
      </section>

      {/* Últimas crónicas (general) */}
      <section aria-label="Últimas crónicas">
        <EncabezadoBloque titulo="Últimas crónicas" />
        {cronicas.cargando || !cronicas.datos ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonTarjeta key={i} />
            ))}
          </div>
        ) : (
          <GrupoAparicion className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {cronicas.datos.map((n) => (
              <ItemAparicion key={n.id}>
                <NoticiaCard noticia={n} />
              </ItemAparicion>
            ))}
          </GrupoAparicion>
        )}
      </section>
    </div>
  )
}
