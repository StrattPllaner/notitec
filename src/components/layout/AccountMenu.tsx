import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

/** Icono de cuenta: silueta simple; "check" cuando hay sesión. */
function IconoCuenta({ activo }: { activo: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      {activo && <path d="M20 6.5 21.5 8 24 5" />}
    </svg>
  )
}

/**
 * Botón de cuenta en el header. Login opcional: si no hay sesión, muestra un
 * formulario compacto; si hay sesión, muestra un menú con cerrar sesión y (para
 * el admin) acceso al panel de edición. No hay pantalla de login obligatoria.
 */
export function AccountMenu() {
  const { user, listo, esAdmin, loginGoogle, logout } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!abierto) return
    function alClic(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', alClic)
    return () => document.removeEventListener('mousedown', alClic)
  }, [abierto])

  async function entrarGoogle() {
    setError('')
    setCargando(true)
    try {
      await loginGoogle()
      setAbierto(false)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (code.includes('popup-closed') || code.includes('cancelled-popup')) {
        // El usuario cerró la ventana: no es un error que mostrar.
      } else if (code.includes('operation-not-allowed') || code.includes('configuration-not-found')) {
        setError('Falta activar el proveedor de Google en la consola de Firebase.')
      } else {
        setError('No se pudo iniciar sesión con Google.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={user ? 'Cuenta' : 'Iniciar sesión'}
        aria-expanded={abierto}
        title={user ? 'Cuenta' : 'Iniciar sesión'}
        className={[
          'inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors',
          user
            ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
        ].join(' ')}
      >
        <IconoCuenta activo={!!user} />
      </button>

      {abierto && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          {!listo ? (
            <p className="text-sm text-neutral-500">Cargando…</p>
          ) : user ? (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">Sesión iniciada</p>
                <p className="truncate text-sm font-semibold">{user.email}</p>
              </div>
              {esAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setAbierto(false)}
                  className="rounded-lg bg-neutral-900 py-2 text-center text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
                >
                  Panel de edición
                </Link>
              )}
              <button
                type="button"
                onClick={async () => {
                  await logout()
                  setAbierto(false)
                }}
                className="rounded-lg border border-neutral-300 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Iniciar sesión</p>
              <button
                type="button"
                onClick={entrarGoogle}
                disabled={cargando}
                className="flex h-11 items-center justify-center gap-3 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
                  <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
                </svg>
                {cargando ? 'Abriendo…' : 'Continuar con Google'}
              </button>
              {error && <p className="text-xs text-acento-600 dark:text-acento-400">{error}</p>}
              <p className="text-xs text-neutral-400">
                Solo la cuenta autorizada puede editar; los demás pueden iniciar sesión sin permisos de edición.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
