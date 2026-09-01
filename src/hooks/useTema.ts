import { useCallback, useEffect, useState } from 'react'

type Tema = 'claro' | 'oscuro'

const CLAVE = 'notitec-tema'

function temaInicial(): Tema {
  if (typeof window === 'undefined') return 'claro'
  const guardado = window.localStorage.getItem(CLAVE)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

/**
 * Maneja el modo claro/oscuro: aplica la clase `dark` en <html> y persiste la
 * preferencia en localStorage.
 */
export function useTema() {
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    const raiz = document.documentElement
    raiz.classList.toggle('dark', tema === 'oscuro')
    window.localStorage.setItem(CLAVE, tema)
  }, [tema])

  const alternar = useCallback(() => {
    setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'))
  }, [])

  return { tema, alternar }
}
