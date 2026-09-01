// ---------------------------------------------------------------------------
// Capa de acceso a ÚLTIMA HORA (franja de titulares breves de la portada).
//
// Se derivan de las notas más recientes. Para una API real, reemplazar por un
// endpoint dedicado de titulares de última hora.
// ---------------------------------------------------------------------------

import type { UltimaHora } from './types'
import { delay } from './utils/delay'
import { getNoticiasDelDia } from './noticias'

/**
 * Titulares breves para la franja de última hora, tomados de las notas más
 * recientes. Se acorta el titular para que quepa en la franja.
 */
export async function getUltimaHora(limite = 6): Promise<UltimaHora[]> {
  await delay(200)
  const recientes = await getNoticiasDelDia(limite)
  return recientes.map((n) => ({
    id: `uh-${n.id}`,
    texto: n.titulo,
    noticiaId: n.id,
  }))
}
