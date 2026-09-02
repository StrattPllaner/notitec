import { useEffect, useState } from 'react'
import type { Partido } from '@/data/types'
import { getPartidosEnVivo, type FiltroPartidos } from '@/data/deportes'

const INTERVALO_MS = 15_000

/**
 * Sondea los partidos en vivo cada 15 s desde la capa de datos, de modo que
 * marcadores y minutos se actualicen solos. Acepta un filtro por deporte/torneo
 * y re-sondea cuando este cambia.
 */
export function usePartidosEnVivo(filtro?: FiltroPartidos) {
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [cargando, setCargando] = useState(true)
  const deporte = filtro?.deporte
  const torneo = filtro?.torneo

  useEffect(() => {
    let vigente = true
    setCargando(true)

    async function refrescar() {
      const datos = await getPartidosEnVivo({ deporte, torneo })
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
  }, [deporte, torneo])

  return { partidos, cargando }
}
