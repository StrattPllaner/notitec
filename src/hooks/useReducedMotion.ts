import { useEffect, useState } from 'react'

/**
 * Indica si el usuario prefiere movimiento reducido. Todas las animaciones no
 * esenciales deben consultar este hook y desactivarse cuando devuelve `true`.
 */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduce
}
