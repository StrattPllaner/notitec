import type { Partido } from '@/data/types'
import { horaCorta } from '@/data/utils/tiempoRelativo'

/** Título de día legible a partir de una fecha ISO corta (AAAA-MM-DD). */
function tituloDia(diaISO: string): string {
  const fecha = new Date(`${diaISO}T12:00:00`)
  const texto = fecha.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function CalendarioPartidos({
  grupos,
}: {
  grupos: { dia: string; partidos: Partido[] }[]
}) {
  if (grupos.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        No hay próximos partidos programados.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {grupos.map((g) => (
        <div key={g.dia}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            {tituloDia(g.dia)}
          </h3>
          <ul className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
            {g.partidos.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 bg-white px-4 py-3 dark:bg-neutral-900"
              >
                <span className="w-12 shrink-0 text-sm font-bold tabular-nums text-acento-600 dark:text-acento-400">
                  {horaCorta(p.inicioISO)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {p.local.nombre}{' '}
                    <span className="text-neutral-400">vs</span> {p.visitante.nombre}
                  </p>
                  <p className="truncate text-xs text-neutral-400 dark:text-neutral-500">
                    {p.competicion} · {p.sede}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
