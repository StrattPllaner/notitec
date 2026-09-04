import { useNoticias } from '@/hooks/useNoticias'
import { destacadaDe, notasDelDia } from '@/data/noticias'
import type { UltimaHora } from '@/data/types'
import { NoticiaDestacada } from '@/components/noticias/NoticiaDestacada'
import { GrillaNoticias } from '@/components/noticias/GrillaNoticias'
import { ListaCompacta } from '@/components/noticias/ListaCompacta'
import { UltimaHoraTicker } from '@/components/noticias/UltimaHoraTicker'
import { EncabezadoBloque } from '@/components/ui/EncabezadoBloque'
import { Skeleton, SkeletonGrilla } from '@/components/ui/Skeleton'
import { Aparicion } from '@/components/ui/animaciones'

export default function Portada() {
  const noticias = useNoticias()
  const destacada = destacadaDe(noticias)
  const delDia = notasDelDia(noticias, 12)
  const enGrilla = delDia.slice(0, 6)
  const enLista = delDia.slice(6, 11)

  const ultimaHora: UltimaHora[] = notasDelDia(noticias, 6).map((n) => ({
    id: `uh-${n.id}`,
    texto: n.titulo,
    noticiaId: n.id,
  }))

  return (
    <>
      <UltimaHoraTicker titulares={ultimaHora} />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Nota principal destacada */}
        <section aria-label="Nota principal" className="mb-12">
          {!destacada ? (
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-3/4" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          ) : (
            <Aparicion>
              <NoticiaDestacada noticia={destacada} />
            </Aparicion>
          )}
        </section>

        {/* Notas del día + columna "Lo último" */}
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
          <section aria-label="Notas del día">
            <EncabezadoBloque titulo="Notas del día" />
            {enGrilla.length === 0 ? (
              <SkeletonGrilla cantidad={6} />
            ) : (
              <GrillaNoticias noticias={enGrilla} />
            )}
          </section>

          <aside aria-label="Lo último" className="lg:border-l lg:border-neutral-200 lg:pl-8 lg:dark:border-neutral-800">
            <EncabezadoBloque titulo="Lo último" />
            <ListaCompacta noticias={enLista} />
          </aside>
        </div>
      </div>
    </>
  )
}
