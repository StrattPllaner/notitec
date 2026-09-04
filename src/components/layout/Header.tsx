import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NavLinks } from './NavLinks'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { AccountMenu } from './AccountMenu'
import { Logo } from './Logo'

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        {/* Botón de menú (móvil y tablet) */}
        <button
          type="button"
          className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {menuAbierto ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        {/* Marca (no se encoge para no encimarse con la navegación) */}
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setMenuAbierto(false)}>
          <Logo size={32} />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-tight">Daily-Tec</span>
            <span className="hidden whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400 lg:block">
              Tec · Campus Cuernavaca
            </span>
          </span>
        </Link>

        {/* Navegación en escritorio grande */}
        <div className="ml-6 hidden lg:block">
          <NavLinks />
        </div>

        {/* Acciones a la derecha */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Búsqueda compacta solo en escritorio grande; si no, vive en el menú. */}
          <div className="hidden lg:block">
            <SearchBar />
          </div>
          <AccountMenu />
          <ThemeToggle />
        </div>
      </div>

      {/* Panel de navegación (móvil y tablet) */}
      {menuAbierto && (
        <div className="flex flex-col gap-4 border-t border-neutral-200 px-4 py-4 dark:border-neutral-800 lg:hidden">
          <SearchBar variant="full" onEnviar={() => setMenuAbierto(false)} />
          <NavLinks orientacion="vertical" onNavegar={() => setMenuAbierto(false)} />
        </div>
      )}
    </header>
  )
}
