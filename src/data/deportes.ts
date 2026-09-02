// ---------------------------------------------------------------------------
// Capa de acceso a DEPORTES.
//
// Única puerta entre la UI y los datos de partidos. Los partidos "en vivo" se
// simulan a partir del reloj real: el minuto avanza con el tiempo y el marcador
// se deriva de la narración guionizada, de modo que al sondear cada 15 s la
// tarjeta cambie sola y "se sienta viva".
//
// Los partidos se clasifican por `deporte` (fútbol, basquetbol, …) y por
// `torneo` (interno, intramuros, representativo).
//
// Para una API real: reemplazar las lecturas del JSON y la función `simular`
// por llamadas `fetch(...)` que ya devuelvan el estado actual del partido.
// ---------------------------------------------------------------------------

import type {
  Deporte,
  DeporteInfo,
  Noticia,
  Partido,
  Torneo,
  TorneoInfo,
} from './types'
import { delay } from './utils/delay'
import { getNoticiasPorSeccion } from './noticias'
import partidosRaw from './fuentes/partidos.json'

const partidos = partidosRaw as Partido[]

// Momento en que se cargó la app; ancla de la simulación en vivo.
const inicioSesion = Date.now()

// Cada cuántos segundos reales avanza un minuto de juego simulado.
const SEGUNDOS_POR_MINUTO = 4

// Desfase inicial por partido para que arranquen escalonados y ya "en curso".
const OFFSET_INICIAL: Record<string, number> = {
  'par-01': 6,
  'par-02': 18,
  'par-03': 33,
  'par-08': 11,
  'par-11': 24,
}

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

/** Minuto de juego simulado para un partido en vivo, tope 90. */
function minutoSimulado(id: string): number {
  const transcurridos = Math.floor((Date.now() - inicioSesion) / 1000 / SEGUNDOS_POR_MINUTO)
  const offset = OFFSET_INICIAL[id] ?? 0
  return Math.min(offset + transcurridos, 90)
}

/**
 * Devuelve el partido con su estado "vivo" resuelto: minuto y marcador
 * derivados de la narración, y narración recortada a lo ya ocurrido.
 */
function simular(partido: Partido): Partido {
  if (partido.estado !== 'en-vivo') {
    return {
      ...partido,
      narracion: [...partido.narracion].sort((a, b) => b.minuto - a.minuto),
    }
  }

  const minuto = minutoSimulado(partido.id)
  const ocurridas = partido.narracion.filter((j) => j.minuto <= minuto)
  const marcadorLocal = ocurridas.filter((j) => j.tipo === 'gol' && j.equipo === 'local').length
  const marcadorVisitante = ocurridas.filter((j) => j.tipo === 'gol' && j.equipo === 'visitante').length
  const finalizado = minuto >= 90

  return {
    ...partido,
    minuto,
    marcadorLocal,
    marcadorVisitante,
    estado: finalizado ? 'finalizado' : 'en-vivo',
    narracion: [...ocurridas].sort((a, b) => b.minuto - a.minuto),
  }
}

/** Filtro opcional por deporte y/o torneo. */
export interface FiltroPartidos {
  deporte?: Deporte
  torneo?: Torneo
}

function coincide(p: Partido, filtro?: FiltroPartidos): boolean {
  if (!filtro) return true
  if (filtro.deporte && p.deporte !== filtro.deporte) return false
  if (filtro.torneo && p.torneo !== filtro.torneo) return false
  return true
}

/** Deportes que tienen al menos un partido, en el orden del catálogo. */
export function getDeportesDisponibles(): DeporteInfo[] {
  return DEPORTES.filter((d) => partidos.some((p) => p.deporte === d.slug))
}

/** Torneos con partidos para un deporte dado, en el orden del catálogo. */
export function getTorneosDisponibles(deporte: Deporte): TorneoInfo[] {
  return TORNEOS.filter((t) =>
    partidos.some((p) => p.deporte === deporte && p.torneo === t.slug),
  )
}

/**
 * Partidos en vivo (con marcador y minuto simulados), opcionalmente filtrados
 * por deporte/torneo.
 */
export async function getPartidosEnVivo(filtro?: FiltroPartidos): Promise<Partido[]> {
  await delay(200)
  return partidos
    .filter((p) => p.estado === 'en-vivo' && coincide(p, filtro))
    .map(simular)
}

/**
 * Próximos partidos agrupados por día (clave = fecha ISO corta AAAA-MM-DD),
 * ordenados cronológicamente. Acepta filtro por deporte/torneo.
 */
export async function getCalendarioPartidos(
  filtro?: FiltroPartidos,
): Promise<{ dia: string; partidos: Partido[] }[]> {
  await delay()
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

/** Resultados recientes (partidos finalizados), del más reciente al más antiguo. */
export async function getResultados(filtro?: FiltroPartidos): Promise<Partido[]> {
  await delay()
  return partidos
    .filter((p) => p.estado === 'finalizado' && coincide(p, filtro))
    .map(simular)
    .sort((a, b) => new Date(b.inicioISO).getTime() - new Date(a.inicioISO).getTime())
}

/** Un partido por id, con su estado simulado si está en vivo. */
export async function getPartido(id: string): Promise<Partido | null> {
  await delay()
  const partido = partidos.find((p) => p.id === id)
  return partido ? simular(partido) : null
}

/** Últimas crónicas deportivas (notas de la sección Deportes). */
export async function getCronicasDeportivas(limite = 4): Promise<Noticia[]> {
  const cronicas = await getNoticiasPorSeccion('deportes')
  return cronicas.slice(0, limite)
}
