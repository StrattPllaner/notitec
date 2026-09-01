import { getNoticiaDestacada, getNoticiasDelDia } from '@/data/noticias'
import { getUltimaHora } from '@/data/ultimaHora'
import { useAsync } from '@/hooks/useAsync'
import { NoticiaDestacada } from '@/components/noticias/NoticiaDestacada'
import { GrillaNoticias } from '@/components/noticias/GrillaNoticias'
import { UltimaHoraTicker } from '@/components/noticias/UltimaHoraTicker'
import { EncabezadoBloque } from '@/components/ui/EncabezadoBloque'
import { Skeleton, SkeletonGrilla } from '@/components/ui/Skeleton'
import { Aparicion } from '@/components/ui/animaciones'

export default function Portada() {
  const ultimaHora = useAsync(() => getUltimaHora(), [])
  const destacada = useAsync(() => getNoticiaDestacada(), [])
  const delDia = useAsync(() => getNoticiasDelDia(8), [])

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

        {/* Notas del día */}
        <section aria-label="Notas del día">
          <EncabezadoBloque titulo="Notas del día" />
          {delDia.cargando || !delDia.datos ? (
            <SkeletonGrilla cantidad={6} />
          ) : (
            <GrillaNoticias noticias={delDia.datos} />
          )}
        </section>
      </div>
    </>
  )
}
