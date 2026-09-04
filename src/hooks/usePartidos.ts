import { useEffect, useState } from 'react'
import type { Partido } from '@/data/types'
import { getCachePartidos, suscribirPartidos } from '@/data/partidosStore'

/**
 * Devuelve todos los partidos en tiempo real (se actualizan solos cuando la
 * cuenta administradora edita un marcador o una alineación).
 */
export function usePartidos(): Partido[] {
  const [partidos, setPartidos] = useState<Partido[]>(getCachePartidos)

  useEffect(() => suscribirPartidos(setPartidos), [])

  return partidos
}
