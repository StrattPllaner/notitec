import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Muestra un número (el marcador) y anima el cambio: el valor saliente sube y
 * se desvanece mientras el nuevo entra desde abajo. Con movimiento reducido,
 * cambia el número sin animación.
 */
export function AnimatedCounter({
  valor,
  className = '',
}: {
  valor: number
  className?: string
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <span className={className}>{valor}</span>
  }

  return (
    <span className={`relative inline-grid overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={valor}
          initial={{ y: '60%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-60%', opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 tabular-nums"
        >
          {valor}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
