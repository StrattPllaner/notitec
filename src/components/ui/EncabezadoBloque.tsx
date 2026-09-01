import type { ReactNode } from 'react'

/** Encabezado de bloque con una barra de acento a la izquierda del título. */
export function EncabezadoBloque({
  titulo,
  accion,
}: {
  titulo: string
  accion?: ReactNode
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-800">
      <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight">
        <span className="h-5 w-1.5 rounded-full bg-acento-600" aria-hidden="true" />
        {titulo}
      </h2>
      {accion}
    </div>
  )
}
