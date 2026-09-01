import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Duraciones y easing compartidos: todo el movimiento vive entre 150–300 ms.
const EASE = [0.22, 1, 0.36, 1] as const

/** Variantes del contenedor: escalona la entrada de sus hijos. */
const contenedorVariants: Variants = {
  oculto: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
}

/** Variantes de cada tarjeta: fade + desplazamiento de 12px hacia arriba. */
const itemVariants: Variants = {
  oculto: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE },
  },
}

/**
 * Contenedor que revela a sus hijos de forma escalonada cuando entra en el
 * viewport. Si el usuario prefiere movimiento reducido, renderiza sin animar.
 */
export function GrupoAparicion({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={contenedorVariants}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
    >
      {children}
    </motion.div>
  )
}

/** Elemento hijo de GrupoAparicion. Usar como wrapper de cada tarjeta. */
export function ItemAparicion({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}

/**
 * Aparición individual (sin escalonar), útil para bloques sueltos como el hero
 * o encabezados de sección.
 */
export function Aparicion({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.28, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
