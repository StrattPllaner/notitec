import { Link } from 'react-router-dom'
import type { Noticia } from '@/data/types'
import { tiempoRelativo } from '@/data/utils/tiempoRelativo'
import { EtiquetaSeccion } from '@/components/ui/EtiquetaSeccion'

/** Nota principal de la portada: imagen grande, titular de peso y entradilla. */
export function NoticiaDestacada({ noticia }: { noticia: Noticia }) {
  return (
    <Link
      to={`/articulo/${noticia.id}`}
      className="group grid gap-6 md:grid-cols-2 md:items-center"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 md:aspect-[4/3]">
        <img
          src={noticia.imagenUrl}
          alt={noticia.imagenAlt}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-4">
        <EtiquetaSeccion seccion={noticia.seccion} className="self-start" />
        <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-neutral-900 transition-colors group-hover:text-acento-600 dark:text-white dark:group-hover:text-acento-400 sm:text-4xl">
          {noticia.titulo}
        </h1>
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
          {noticia.entradilla}
        </p>
        <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="font-medium text-neutral-700 dark:text-neutral-200">
            {noticia.autor.nombre}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={noticia.fechaISO}>{tiempoRelativo(noticia.fechaISO)}</time>
        </div>
      </div>
    </Link>
  )
}
