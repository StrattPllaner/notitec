import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Auth, User } from 'firebase/auth'
import { app, ADMIN_EMAIL } from './firebase'

interface AuthCtx {
  /** Usuario actual, o null si no hay sesión. */
  user: User | null
  /** true cuando ya se comprobó el estado inicial de sesión. */
  listo: boolean
  /** true si el usuario es la cuenta administradora autorizada a editar. */
  esAdmin: boolean
  /** Inicia sesión con Google (ventana emergente). */
  loginGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

/**
 * Proveedor de autenticación global. Carga el SDK de Firebase Auth de forma
 * diferida (import dinámico) para no incluirlo en el bundle inicial de las
 * páginas públicas; el login es totalmente opcional.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [listo, setListo] = useState(false)
  const [auth, setAuth] = useState<Auth | null>(null)

  useEffect(() => {
    let unsub = () => {}
    let vigente = true
    ;(async () => {
      try {
        const { getAuth, onAuthStateChanged } = await import('firebase/auth')
        if (!vigente) return
        const a = getAuth(app)
        setAuth(a)
        unsub = onAuthStateChanged(a, (u) => {
          setUser(u)
          setListo(true)
        })
      } catch {
        if (vigente) setListo(true)
      }
    })()
    return () => {
      vigente = false
      unsub()
    }
  }, [])

  const loginGoogle = useCallback(async () => {
    const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    await signInWithPopup(auth ?? getAuth(app), provider)
  }, [auth])

  const logout = useCallback(async () => {
    const { getAuth, signOut } = await import('firebase/auth')
    await signOut(auth ?? getAuth(app))
  }, [auth])

  const esAdmin = !!user && user.email === ADMIN_EMAIL

  return (
    <Ctx.Provider value={{ user, listo, esAdmin, loginGoogle, logout }}>{children}</Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return c
}
