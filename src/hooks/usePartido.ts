import { useEffect, useState } from 'react'
import type { Partido } from '@/data/types'
import { getPartido } from '@/data/deportes'

const INTERVALO_MS = 15_000

/**
 * Carga un partido por id y, si está en vivo, lo re-sondea cada 15 s para que
 * marcador, minuto y narración avancen. Deja de sondear cuando el partido ya
 * no está en vivo.
 */
export function usePartido(id: string | undefined) {
  const [partido, setPartido] = useState<Partido | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!id) return
    let vigente = true

    async function refrescar() {
      const datos = await getPartido(id as string)
      if (!vigente) return
      setPartido(datos)
      setCargando(false)
      // Detiene el sondeo si ya no hay nada que actualizar.
      if (datos && datos.estado !== 'en-vivo' && datos.estado !== 'medio-tiempo') {
        window.clearInterval(intervalo)
      }
    }

    const intervalo = window.setInterval(refrescar, INTERVALO_MS)
    refrescar()
    return () => {
      vigente = false
      window.clearInterval(intervalo)
    }
  }, [id])

  return { partido, cargando }
}
