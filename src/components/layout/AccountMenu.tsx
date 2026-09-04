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
  const { user, listo, esAdmin, login, logout } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
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

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await login(email, pass)
      setPass('')
      setAbierto(false)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      setError(
        code.includes('configuration-not-found')
          ? 'Falta activar Email/Password en la consola de Firebase.'
          : 'Correo o contraseña incorrectos.',
      )
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
            <form onSubmit={entrar} className="flex flex-col gap-2">
              <p className="mb-1 text-sm font-semibold">Iniciar sesión</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                autoComplete="username"
                className="h-10 rounded-lg border border-neutral-300 bg-transparent px-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
              />
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Contraseña"
                autoComplete="current-password"
                className="h-10 rounded-lg border border-neutral-300 bg-transparent px-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
              />
              {error && <p className="text-xs text-acento-600 dark:text-acento-400">{error}</p>}
              <button
                type="submit"
                disabled={cargando}
                className="h-10 rounded-lg bg-neutral-900 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
              >
                {cargando ? 'Entrando…' : 'Entrar'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
