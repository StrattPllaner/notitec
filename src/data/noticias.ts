// ---------------------------------------------------------------------------
// Capa de acceso a NOTICIAS.
//
// Es la ÚNICA puerta entre la UI y los datos de notas. Los componentes llaman a
// estas funciones async y jamás importan el JSON directamente. Para conectar
// una API real, basta reescribir el cuerpo de cada función (cambiar la lectura
// del JSON local por `fetch(...)`) sin tocar componentes ni tipos.
// ---------------------------------------------------------------------------

import type { Autor, Noticia, Seccion, SeccionInfo } from './types'
import { delay } from './utils/delay'
import noticiasRaw from './fuentes/noticias.json'
import autoresRaw from './fuentes/autores.json'

/** Forma cruda de una noticia en el JSON: referencia al autor por id. */
interface NoticiaRaw {
  id: string
  titulo: string
  entradilla: string
  seccion: Seccion
  autorId: string
  fechaISO: string
  imagenUrl: string
  imagenAlt: string
  minutosLectura: number
  cuerpo: string[]
  destacada?: boolean
}

const autores = autoresRaw as Autor[]

/** Resuelve la relación noticia→autor, como haría un `join` en una API real. */
function hidratar(raw: NoticiaRaw): Noticia {
  const autor =
    autores.find((a) => a.id === raw.autorId) ?? {
      id: 'desconocido',
      nombre: 'Redacción Notitec',
      rol: 'Redacción',
      avatarUrl: 'https://i.pravatar.cc/120?img=1',
    }
  const { autorId, ...resto } = raw
  return { ...resto, autor }
}

const noticias: Noticia[] = (noticiasRaw as NoticiaRaw[]).map(hidratar)

/** Ordena de más reciente a más antigua. */
function porFecha(a: Noticia, b: Noticia): number {
  return new Date(b.fechaISO).getTime() - new Date(a.fechaISO).getTime()
}

/** Catálogo de secciones con su nombre legible, para navegación y encabezados. */
export const SECCIONES: SeccionInfo[] = [
  { slug: 'campus', nombre: 'Campus' },
  { slug: 'academico', nombre: 'Académico' },
  { slug: 'estudiantil', nombre: 'Estudiantil' },
  { slug: 'cultura', nombre: 'Cultura' },
  { slug: 'deportes', nombre: 'Deportes' },
]

export function nombreSeccion(slug: Seccion): string {
  return SECCIONES.find((s) => s.slug === slug)?.nombre ?? slug
}

/** Nota principal destacada de la portada. */
export async function getNoticiaDestacada(): Promise<Noticia> {
  await delay()
  const destacada = noticias.find((n) => n.destacada)
  // Si nadie está marcado como destacada, cae a la más reciente.
  return destacada ?? [...noticias].sort(porFecha)[0]
}

/**
 * Notas del día para la rejilla de la portada (excluye la destacada).
 * @param limite número máximo de notas a devolver.
 */
export async function getNoticiasDelDia(limite = 8): Promise<Noticia[]> {
  await delay()
  return noticias
    .filter((n) => !n.destacada)
    .sort(porFecha)
    .slice(0, limite)
}

/** Todas las notas de una sección, de más reciente a más antigua. */
export async function getNoticiasPorSeccion(seccion: Seccion): Promise<Noticia[]> {
  await delay()
  return noticias.filter((n) => n.seccion === seccion).sort(porFecha)
}

/** Una nota por id, o `null` si no existe. */
export async function getArticulo(id: string): Promise<Noticia | null> {
  await delay()
  return noticias.find((n) => n.id === id) ?? null
}

/**
 * Notas relacionadas con un artículo: prioriza la misma sección y excluye
 * la propia nota. Devuelve como máximo `limite`.
 */
export async function getRelacionadas(id: string, limite = 3): Promise<Noticia[]> {
  await delay()
  const base = noticias.find((n) => n.id === id)
  if (!base) return []
  const mismaSeccion = noticias
    .filter((n) => n.id !== id && n.seccion === base.seccion)
    .sort(porFecha)
  const resto = noticias
    .filter((n) => n.id !== id && n.seccion !== base.seccion)
    .sort(porFecha)
  return [...mismaSeccion, ...resto].slice(0, limite)
}

/** Búsqueda simple por texto en titular y entradilla. */
export async function buscarNoticias(consulta: string): Promise<Noticia[]> {
  await delay()
  const q = consulta.trim().toLowerCase()
  if (!q) return []
  return noticias
    .filter(
      (n) =>
        n.titulo.toLowerCase().includes(q) ||
        n.entradilla.toLowerCase().includes(q) ||
        nombreSeccion(n.seccion).toLowerCase().includes(q),
    )
    .sort(porFecha)
}
