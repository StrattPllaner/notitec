import { getNoticiaDestacada, getNoticiasDelDia } from '@/data/noticias'
import { getUltimaHora } from '@/data/ultimaHora'
import { useAsync } from '@/hooks/useAsync'
import { NoticiaDestacada } from '@/components/noticias/NoticiaDestacada'
import { GrillaNoticias } from '@/components/noticias/GrillaNoticias'
import { ListaCompacta } from '@/components/noticias/ListaCompacta'
import { UltimaHoraTicker } from '@/components/noticias/UltimaHoraTicker'
import { EncabezadoBloque } from '@/components/ui/EncabezadoBloque'
import { Skeleton, SkeletonGrilla } from '@/components/ui/Skeleton'
import { Aparicion } from '@/components/ui/animaciones'

export default function Portada() {
  const ultimaHora = useAsync(() => getUltimaHora(), [])
  const destacada = useAsync(() => getNoticiaDestacada(), [])
  const delDia = useAsync(() => getNoticiasDelDia(12), [])

  const enGrilla = delDia.datos?.slice(0, 6) ?? []
  const enLista = delDia.datos?.slice(6, 11) ?? []

  return (
    <>
      {ultimaHora.datos && <UltimaHoraTicker titulares={ultimaHora.datos} />}

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Nota principal destacada */}
        <section aria-label="Nota principal" className="mb-12">
          {destacada.cargando || !destacada.datos ? (
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </div>
          ) : (
            <Aparicion>
              <NoticiaDestacada noticia={destacada.datos} />
            </Aparicion>
          )}
        </section>

        {/* Notas del día + columna "Lo último" */}
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
          <section aria-label="Notas del día">
            <EncabezadoBloque titulo="Notas del día" />
            {delDia.cargando || !delDia.datos ? (
              <SkeletonGrilla cantidad={6} />
            ) : (
              <GrillaNoticias noticias={enGrilla} />
            )}
          </section>

          <aside aria-label="Lo último" className="lg:border-l lg:border-neutral-200 lg:pl-8 lg:dark:border-neutral-800">
            <EncabezadoBloque titulo="Lo último" />
            {delDia.cargando || !delDia.datos ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            ) : (
              <ListaCompacta noticias={enLista} />
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
