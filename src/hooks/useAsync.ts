import { useEffect, useState } from 'react'

interface EstadoAsync<T> {
  datos: T | null
  cargando: boolean
  error: Error | null
}

/**
 * Ejecuta una función async de la capa de datos y expone {datos, cargando,
 * error}. Se re-ejecuta cuando cambian las `deps`. Evita actualizar el estado
 * si el componente se desmontó o si la petición quedó obsoleta.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): EstadoAsync<T> {
  const [estado, setEstado] = useState<EstadoAsync<T>>({
    datos: null,
    cargando: true,
    error: null,
  })

  useEffect(() => {
    let vigente = true
    setEstado({ datos: null, cargando: true, error: null })

    fn()
      .then((datos) => {
        if (vigente) setEstado({ datos, cargando: false, error: null })
      })
      .catch((error: Error) => {
        if (vigente) setEstado({ datos: null, cargando: false, error })
      })

    return () => {
      vigente = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return estado
}
