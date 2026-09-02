import { NavLink } from 'react-router-dom'
import { SECCIONES } from '@/data/noticias'

/**
 * Enlaces de navegación entre secciones. El subrayado se "dibuja" (scaleX de
 * 0 a 1, con origen a la izquierda) en hover y cuando la ruta está activa.
 * La transición se desactiva sola con prefers-reduced-motion (regla global).
 */
export function NavLinks({
  orientacion = 'horizontal',
  onNavegar,
}: {
  orientacion?: 'horizontal' | 'vertical'
  onNavegar?: () => void
}) {
  return (
    <nav
      className={
        orientacion === 'horizontal'
          ? 'flex items-center gap-6'
          : 'flex flex-col'
      }
      aria-label="Secciones"
    >
      {SECCIONES.map((s) => (
        <NavLink
          key={s.slug}
          to={`/seccion/${s.slug}`}
          onClick={onNavegar}
          className={({ isActive }) =>
            [
              'group relative font-semibold transition-colors',
              orientacion === 'vertical'
                ? 'flex items-center py-3 text-base'
                : 'py-1 text-sm',
              isActive
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              {s.nombre}
              <span
                className={[
                  'absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-acento-500 transition-transform duration-200 ease-out',
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                ].join(' ')}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
