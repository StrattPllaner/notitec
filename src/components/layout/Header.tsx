import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NavLinks } from './NavLinks'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { Logo } from './Logo'

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        {/* Botón de menú (solo móvil) */}
        <button
          type="button"
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 md:hidden"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {menuAbierto ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        {/* Marca */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuAbierto(false)}>
          <Logo size={32} />
          <span className="font-serif text-xl font-bold tracking-tight">Notitec</span>
        </Link>

        {/* Navegación de escritorio */}
        <div className="ml-6 hidden md:block">
          <NavLinks />
        </div>

        {/* Acciones a la derecha */}
        <div className="ml-auto flex items-center gap-2">
          <SearchBar />
          <ThemeToggle />
        </div>
      </div>

      {/* Panel de navegación móvil */}
      {menuAbierto && (
        <div className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800 md:hidden">
          <NavLinks orientacion="vertical" onNavegar={() => setMenuAbierto(false)} />
        </div>
      )}
    </header>
  )
}
