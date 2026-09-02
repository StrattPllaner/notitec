import { getCalendarioPartidos, getCronicasDeportivas } from '@/data/deportes'
import { useAsync } from '@/hooks/useAsync'
import { usePartidosEnVivo } from '@/hooks/usePartidosEnVivo'
import { MarcadorEnVivoCard } from '@/components/deportes/MarcadorEnVivoCard'
import { CalendarioPartidos } from '@/components/deportes/CalendarioPartidos'
import { NoticiaCard } from '@/components/noticias/NoticiaCard'
import { EncabezadoBloque } from '@/components/ui/EncabezadoBloque'
import { Skeleton, SkeletonTarjeta } from '@/components/ui/Skeleton'
import { GrupoAparicion, ItemAparicion } from '@/components/ui/animaciones'

export default function Deportes() {
  const enVivo = usePartidosEnVivo()
  const calendario = useAsync(() => getCalendarioPartidos(), [])
  const cronicas = useAsync(() => getCronicasDeportivas(4), [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          Sección
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Deportes
        </h1>
      </header>

      {/* Bloque 1: Marcadores en vivo */}
      <section className="mb-12" aria-label="Marcadores en vivo">
        <EncabezadoBloque titulo="Marcadores en vivo" />
        {enVivo.cargando ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : enVivo.partidos.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No hay partidos en vivo en este momento.
          </p>
        ) : (
          <GrupoAparicion className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enVivo.partidos.map((p) => (
              <ItemAparicion key={p.id}>
                <MarcadorEnVivoCard partido={p} />
              </ItemAparicion>
            ))}
          </GrupoAparicion>
        )}
      </section>

      <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
        {/* Bloque 3: Últimas crónicas */}
        <section aria-label="Últimas crónicas">
          <EncabezadoBloque titulo="Últimas crónicas" />
          {cronicas.cargando || !cronicas.datos ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonTarjeta key={i} />
              ))}
            </div>
          ) : (
            <GrupoAparicion className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              {cronicas.datos.map((n) => (
                <ItemAparicion key={n.id}>
                  <NoticiaCard noticia={n} />
                </ItemAparicion>
              ))}
            </GrupoAparicion>
          )}
        </section>

        {/* Bloque 2: Calendario de próximos partidos */}
        <section aria-label="Próximos partidos">
          <EncabezadoBloque titulo="Próximos partidos" />
          {calendario.cargando || !calendario.datos ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <CalendarioPartidos grupos={calendario.datos} />
          )}
        </section>
      </div>
    </div>
  )
}
