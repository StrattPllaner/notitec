import { Link } from 'react-router-dom'
import { SECCIONES } from '@/data/noticias'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-serif text-xl font-bold tracking-tight">Notitec</span>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Secciones">
            {SECCIONES.map((s) => (
              <Link
                key={s.slug}
                to={`/seccion/${s.slug}`}
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                {s.nombre}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-xs text-neutral-400 dark:text-neutral-500">
          © 2026 Notitec · Medio estudiantil del Tec de Monterrey, Campus Cuernavaca.
          Sitio de demostración con contenido simulado; no es un medio oficial del
          Tecnológico de Monterrey.
        </p>
      </div>
    </footer>
  )
}
