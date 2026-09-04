// ---------------------------------------------------------------------------
// Capa de acceso a DEPORTES.
//
// Los partidos vienen en tiempo real de Firestore a través de `partidosStore`
// (con respaldo al JSON local). Aquí viven los catálogos (deportes, torneos) y
// funciones puras para filtrar/agrupar un arreglo de partidos, más las crónicas
// deportivas (que son notas).
// ---------------------------------------------------------------------------

import type {
  Deporte,
  DeporteInfo,
  Noticia,
  Partido,
  Torneo,
  TorneoInfo,
} from './types'
import { getNoticiasPorSeccion } from './noticias'

// Catálogos ordenados (para las pestañas de la sección Deportes).
export const DEPORTES: DeporteInfo[] = [
  { slug: 'futbol', nombre: 'Fútbol' },
  { slug: 'basquetbol', nombre: 'Basquetbol' },
  { slug: 'futbol-americano', nombre: 'Fútbol americano' },
]

export const TORNEOS: TorneoInfo[] = [
  { slug: 'interno', nombre: 'Interno' },
  { slug: 'intramuros', nombre: 'Intramuros' },
  { slug: 'representativo', nombre: 'Repre' },
]

export function nombreDeporte(slug: Deporte): string {
  return DEPORTES.find((d) => d.slug === slug)?.nombre ?? slug
}

export function nombreTorneo(slug: Torneo): string {
  return TORNEOS.find((t) => t.slug === slug)?.nombre ?? slug
}

/** Filtro por deporte y/o torneo. */
export interface FiltroPartidos {
  deporte?: Deporte
  torneo?: Torneo
}

export function coincide(p: Partido, filtro?: FiltroPartidos): boolean {
  if (!filtro) return true
  if (filtro.deporte && p.deporte !== filtro.deporte) return false
  if (filtro.torneo && p.torneo !== filtro.torneo) return false
  return true
}

/** Deportes que tienen al menos un partido, en el orden del catálogo. */
export function getDeportesDisponibles(partidos: Partido[]): DeporteInfo[] {
  return DEPORTES.filter((d) => partidos.some((p) => p.deporte === d.slug))
}

/** Torneos con partidos para un deporte dado, en el orden del catálogo. */
export function getTorneosDisponibles(partidos: Partido[], deporte: Deporte): TorneoInfo[] {
  return TORNEOS.filter((t) =>
    partidos.some((p) => p.deporte === deporte && p.torneo === t.slug),
  )
}

const enCurso = (p: Partido) => p.estado === 'en-vivo' || p.estado === 'medio-tiempo'

/** Partidos en vivo que cumplen el filtro. */
export function filtrarEnVivo(partidos: Partido[], filtro?: FiltroPartidos): Partido[] {
  return partidos.filter((p) => enCurso(p) && coincide(p, filtro))
}

/** Próximos partidos (programados) agrupados por día, orden cronológico. */
export function agruparProximos(
  partidos: Partido[],
  filtro?: FiltroPartidos,
): { dia: string; partidos: Partido[] }[] {
  const programados = partidos
    .filter((p) => p.estado === 'programado' && coincide(p, filtro))
    .sort((a, b) => new Date(a.inicioISO).getTime() - new Date(b.inicioISO).getTime())

  const grupos = new Map<string, Partido[]>()
  for (const p of programados) {
    const dia = p.inicioISO.slice(0, 10)
    const lista = grupos.get(dia) ?? []
    lista.push(p)
    grupos.set(dia, lista)
  }
  return [...grupos.entries()].map(([dia, lista]) => ({ dia, partidos: lista }))
}

/** Resultados (finalizados) que cumplen el filtro, del más reciente al más antiguo. */
export function filtrarResultados(partidos: Partido[], filtro?: FiltroPartidos): Partido[] {
  return partidos
    .filter((p) => p.estado === 'finalizado' && coincide(p, filtro))
    .sort((a, b) => new Date(b.inicioISO).getTime() - new Date(a.inicioISO).getTime())
}

/** Últimas crónicas deportivas (notas de la sección Deportes). */
export async function getCronicasDeportivas(limite = 4): Promise<Noticia[]> {
  const cronicas = await getNoticiasPorSeccion('deportes')
  return cronicas.slice(0, limite)
}
