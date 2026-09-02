import type { Seccion } from '@/data/types'

// Paleta monocromática: las secciones no se distinguen por color, solo por
// tipografía y jerarquía. Se mantienen las mismas claves para no tocar la UI.

/** Color de texto de la etiqueta de sección (gris oscuro / gris claro en dark). */
const TEXTO_MONO = 'text-neutral-700 dark:text-neutral-300'

export const COLOR_SECCION: Record<Seccion, string> = {
  nacional: TEXTO_MONO,
  economia: TEXTO_MONO,
  tecnologia: TEXTO_MONO,
  cultura: TEXTO_MONO,
  deportes: TEXTO_MONO,
}

/** Fondo suave por sección para las etiquetas tipo "chip" (gris neutro). */
const FONDO_MONO = 'bg-neutral-900/[0.06] text-neutral-700 dark:bg-white/10 dark:text-neutral-200'

export const FONDO_SECCION: Record<Seccion, string> = {
  nacional: FONDO_MONO,
  economia: FONDO_MONO,
  tecnologia: FONDO_MONO,
  cultura: FONDO_MONO,
  deportes: FONDO_MONO,
}
