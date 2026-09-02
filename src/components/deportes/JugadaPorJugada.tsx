import type { Jugada } from '@/data/types'

/** Icono/emoji breve según el tipo de jugada. */
const ICONO: Record<Jugada['tipo'], string> = {
  gol: '⚽',
  amarilla: '🟨',
  roja: '🟥',
  cambio: '🔁',
  ocasion: '⚡',
  inicio: '▶',
  fin: '⏹',
  info: 'ℹ',
}

/**
 * Narración en texto, jugada por jugada, de más reciente a más antigua.
 * Es contenido de lectura: no se anima en bucle.
 */
export function JugadaPorJugada({ jugadas }: { jugadas: Jugada[] }) {
  if (jugadas.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        La narración comenzará cuando arranque el partido.
      </p>
    )
  }

  return (
    <ol className="relative flex flex-col gap-4 border-l border-neutral-200 pl-6 dark:border-neutral-800">
      {jugadas.map((j, i) => {
        const esGol = j.tipo === 'gol'
        return (
          <li key={`${j.minuto}-${i}`} className="relative">
            <span
              className={`absolute -left-[1.72rem] flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                esGol
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800'
              }`}
              aria-hidden="true"
            >
              {ICONO[j.tipo]}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                {j.minuto}&apos;
              </span>
              <p
                className={`text-sm ${
                  esGol
                    ? 'font-semibold text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {j.texto}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
