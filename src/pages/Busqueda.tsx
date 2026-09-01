import { useSearchParams } from 'react-router-dom'
import { buscarNoticias } from '@/data/noticias'
import { useAsync } from '@/hooks/useAsync'
import { GrillaNoticias } from '@/components/noticias/GrillaNoticias'
import { SkeletonGrilla } from '@/components/ui/Skeleton'

export default function Busqueda() {
  const [params] = useSearchParams()
  const consulta = params.get('q') ?? ''
  const { datos, cargando } = useAsync(() => buscarNoticias(consulta), [consulta])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-acento-600 dark:text-acento-400">
          Búsqueda
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight sm:text-3xl">
          {consulta ? (
            <>
              Resultados para <span className="text-acento-600 dark:text-acento-400">«{consulta}»</span>
            </>
          ) : (
            'Escribe algo para buscar'
          )}
        </h1>
      </header>

      {!consulta ? null : cargando || !datos ? (
        <SkeletonGrilla cantidad={6} />
      ) : datos.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          No encontramos notas que coincidan con tu búsqueda. Intenta con otras
          palabras.
        </p>
      ) : (
        <>
          <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
            {datos.length} {datos.length === 1 ? 'resultado' : 'resultados'}
          </p>
          <GrillaNoticias noticias={datos} />
        </>
      )}
    </div>
  )
}
