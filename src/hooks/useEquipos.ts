import { useEffect, useState } from 'react'
import type { Equipo } from '@/data/types'
import { getCacheEquipos, suscribirEquipos } from '@/data/equiposStore'

/** Catálogo de equipos en tiempo real. */
export function useEquipos(): Equipo[] {
  const [equipos, setEquipos] = useState<Equipo[]>(getCacheEquipos)
  useEffect(() => suscribirEquipos(setEquipos), [])
  return equipos
}
