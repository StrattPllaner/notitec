import { useTema } from '@/hooks/useTema'

/** Botón para alternar entre modo claro y oscuro. */
export function ThemeToggle() {
  const { tema, alternar } = useTema()
  const esOscuro = tema === 'oscuro'

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={esOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={esOscuro ? 'Modo claro' : 'Modo oscuro'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      {esOscuro ? (
        // Sol
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // Luna
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}
