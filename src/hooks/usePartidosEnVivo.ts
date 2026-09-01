import { useEffect, useState } from 'react'
import type { Partido } from '@/data/types'
import { getPartidosEnVivo } from '@/data/deportes'

const INTERVALO_MS = 15_000

/**
 * Sondea los partidos en vivo cada 15 s desde la capa de datos, de modo que
 * marcadores y minutos se actualicen solos. Devuelve además el estado de la
 * carga inicial para mostrar skeletons.
 */
export function usePartidosEnVivo() {
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vigente = true

    async function refrescar() {
      const datos = await getPartidosEnVivo()
      if (!vigente) return
      setPartidos(datos)
      setCargando(false)
    }

    refrescar()
    const id = window.setInterval(refrescar, INTERVALO_MS)
    return () => {
      vigente = false
      window.clearInterval(id)
    }
  }, [])

  return { partidos, cargando }
}
