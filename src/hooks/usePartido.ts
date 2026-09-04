import type { Partido } from '@/data/types'
import { usePartidos } from './usePartidos'

/**
 * Devuelve un partido por id en tiempo real. `cargando` es true solo hasta que
 * llega el primer dato (que es casi inmediato gracias a la caché local).
 */
export function usePartido(id: string | undefined): { partido: Partido | null; cargando: boolean } {
  const partidos = usePartidos()
  if (!id) return { partido: null, cargando: false }
  const partido = partidos.find((p) => p.id === id) ?? null
  // Si aún no hay ningún partido cargado, seguimos "cargando".
  return { partido, cargando: partidos.length === 0 }
}
