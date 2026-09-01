import type { Seccion } from '@/data/types'

/** Clases de color de acento por sección, para etiquetas y detalles finos. */
export const COLOR_SECCION: Record<Seccion, string> = {
  nacional: 'text-acento-600 dark:text-acento-400',
  economia: 'text-emerald-600 dark:text-emerald-400',
  tecnologia: 'text-sky-600 dark:text-sky-400',
  cultura: 'text-violet-600 dark:text-violet-400',
  deportes: 'text-amber-600 dark:text-amber-400',
}

/** Fondo suave por sección para las etiquetas tipo "chip". */
export const FONDO_SECCION: Record<Seccion, string> = {
  nacional: 'bg-acento-500/10 text-acento-700 dark:text-acento-300',
  economia: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  tecnologia: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  cultura: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  deportes: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
}
