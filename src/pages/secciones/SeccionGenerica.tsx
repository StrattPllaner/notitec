import { useParams } from 'react-router-dom'
import type { Seccion } from '@/data/types'
import { getNoticiasPorSeccion, nombreSeccion, SECCIONES } from '@/data/noticias'
import { useAsync } from '@/hooks/useAsync'
import { GrillaNoticias } from '@/components/noticias/GrillaNoticias'
import { SkeletonGrilla } from '@/components/ui/Skeleton'
import { COLOR_SECCION } from '@/lib/constantes'
import NoEncontrado from '@/pages/NoEncontrado'

/** Secciones que usan esta plantilla genérica (Deportes tiene la suya propia). */
const SLUGS_VALIDOS: Seccion[] = SECCIONES.map((s) => s.slug).filter(
  (s) => s !== 'deportes',
)

function esSeccionValida(slug: string | undefined): slug is Seccion {
  return !!slug && SLUGS_VALIDOS.includes(slug as Seccion)
}

export default function SeccionGenerica() {
  const { slug } = useParams<{ slug: string }>()
  const valida = esSeccionValida(slug)
  const seccion = slug as Seccion

  const { datos, cargando } = useAsync(
    () => (valida ? getNoticiasPorSeccion(seccion) : Promise.resolve([])),
    [slug],
  )

  if (!valida) return <NoEncontrado />

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <p className={`text-sm font-semibold uppercase tracking-widest ${COLOR_SECCION[seccion]}`}>
          Sección
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {nombreSeccion(seccion)}
        </h1>
      </header>

      {cargando || !datos ? (
        <SkeletonGrilla cantidad={6} />
      ) : datos.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          No hay notas en esta sección por ahora.
        </p>
      ) : (
        <GrillaNoticias noticias={datos} />
      )}
    </div>
  )
}
