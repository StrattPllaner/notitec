import { Link, useParams } from 'react-router-dom'
import { articuloDe, nombreSeccion, relacionadasDe } from '@/data/noticias'
import { useNoticias } from '@/hooks/useNoticias'
import { fechaLarga } from '@/data/utils/tiempoRelativo'
import { EtiquetaSeccion } from '@/components/ui/EtiquetaSeccion'
import { EncabezadoBloque } from '@/components/ui/EncabezadoBloque'
import { CompartirBoton } from '@/components/noticias/CompartirBoton'
import { NoticiasRelacionadas } from '@/components/noticias/NoticiasRelacionadas'
import NoEncontrado from '@/pages/NoEncontrado'

export default function Articulo() {
  const { id } = useParams<{ id: string }>()
  const noticias = useNoticias()
  const n = articuloDe(noticias, id ?? '')
  const relacionadas = id ? relacionadasDe(noticias, id, 3) : []

  if (!n) return <NoEncontrado />

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <article>
        <header className="flex flex-col gap-4">
          <EtiquetaSeccion seccion={n.seccion} className="self-start" />
          <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {n.titulo}
          </h1>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            {n.entradilla}
          </p>

          {/* Firma: autor, fecha y tiempo de lectura */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-neutral-200 py-4 dark:border-neutral-800">
            <img src={n.autor.avatarUrl} alt="" aria-hidden="true" className="h-10 w-10 rounded-full" />
            <div className="mr-auto">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {n.autor.nombre}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{n.autor.rol}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
              <time dateTime={n.fechaISO}>{fechaLarga(n.fechaISO)}</time>
              <span aria-hidden="true">·</span>
              <span>{n.minutosLectura} min de lectura</span>
            </div>
          </div>
        </header>

        {/* Imagen principal */}
        <figure className="mt-6">
          <img
            src={n.imagenUrl}
            alt={n.imagenAlt}
            className="aspect-[16/9] w-full rounded-xl object-cover"
          />
          <figcaption className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
            {n.imagenAlt}
          </figcaption>
        </figure>

        {/* Cuerpo: sin animación */}
        <div className="mt-8 flex flex-col gap-5 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
          {n.cuerpo.map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>

        {/* Compartir */}
        <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <Link
            to={`/seccion/${n.seccion}`}
            className="text-sm font-medium text-acento-600 transition-colors hover:text-acento-700 dark:text-acento-400"
          >
            ← Más de {nombreSeccion(n.seccion)}
          </Link>
          <CompartirBoton titulo={n.titulo} />
        </div>
      </article>

      {/* Notas relacionadas */}
      {relacionadas.length > 0 && (
        <section className="mt-16">
          <EncabezadoBloque titulo="Notas relacionadas" />
          <NoticiasRelacionadas noticias={relacionadas} />
        </section>
      )}
    </div>
  )
}
