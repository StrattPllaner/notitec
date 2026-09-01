import type { Seccion } from '@/data/types'
import { nombreSeccion } from '@/data/noticias'
import { FONDO_SECCION } from '@/lib/constantes'

/** Chip con el nombre de la sección, coloreado según la sección. */
export function EtiquetaSeccion({
  seccion,
  className = '',
}: {
  seccion: Seccion
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${FONDO_SECCION[seccion]} ${className}`}
    >
      {nombreSeccion(seccion)}
    </span>
  )
}
