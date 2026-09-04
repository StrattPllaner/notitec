// ---------------------------------------------------------------------------
// Capa de acceso a NOTICIAS.
//
// Los datos vienen en tiempo real de Firestore vía `noticiasStore` (con
// respaldo al JSON local). Aquí viven el catálogo de secciones, helpers puros
// para consultar un arreglo de notas, y envolturas async que leen la caché.
// ---------------------------------------------------------------------------

import type { Noticia, Seccion, SeccionInfo } from './types'
import { getCacheNoticias } from './noticiasStore'

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

// ----------------------- Helpers puros (sobre un arreglo) ------------------

export function destacadaDe(noticias: Noticia[]): Noticia | undefined {
  return noticias.find((n) => n.destacada) ?? [...noticias].sort(porFecha)[0]
}

export function notasDelDia(noticias: Noticia[], limite = 8): Noticia[] {
  return noticias
    .filter((n) => !n.destacada)
    .sort(porFecha)
    .slice(0, limite)
}

export function porSeccionDe(noticias: Noticia[], seccion: Seccion): Noticia[] {
  return noticias.filter((n) => n.seccion === seccion).sort(porFecha)
}

export function articuloDe(noticias: Noticia[], id: string): Noticia | null {
  return noticias.find((n) => n.id === id) ?? null
}

export function relacionadasDe(noticias: Noticia[], id: string, limite = 3): Noticia[] {
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

export function buscarEn(noticias: Noticia[], consulta: string): Noticia[] {
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

// ----------------------- Envolturas async (leen la caché) ------------------

export async function getNoticiaDestacada(): Promise<Noticia> {
  return destacadaDe(getCacheNoticias()) as Noticia
}

export async function getNoticiasDelDia(limite = 8): Promise<Noticia[]> {
  return notasDelDia(getCacheNoticias(), limite)
}

export async function getNoticiasPorSeccion(seccion: Seccion): Promise<Noticia[]> {
  return porSeccionDe(getCacheNoticias(), seccion)
}

export async function getArticulo(id: string): Promise<Noticia | null> {
  return articuloDe(getCacheNoticias(), id)
}

export async function getRelacionadas(id: string, limite = 3): Promise<Noticia[]> {
  return relacionadasDe(getCacheNoticias(), id, limite)
}

export async function buscarNoticias(consulta: string): Promise<Noticia[]> {
  return buscarEn(getCacheNoticias(), consulta)
}
