import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * Barra de búsqueda. Al enviar, navega a /buscar?q=... (una de las cuatro
 * acciones del sitio). En pantallas chicas se despliega desde un icono.
 */
export function SearchBar() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [abierta, setAbierta] = useState(false)
  const [valor, setValor] = useState(params.get('q') ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (abierta) inputRef.current?.focus()
  }, [abierta])

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const q = valor.trim()
    if (!q) return
    navigate(`/buscar?q=${encodeURIComponent(q)}`)
    setAbierta(false)
  }

  return (
    <form onSubmit={enviar} className="flex items-center" role="search">
      <div
        className={[
          'flex items-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 transition-all dark:border-neutral-700 dark:bg-neutral-900',
          abierta ? 'w-44 sm:w-56' : 'w-9 sm:w-56',
        ].join(' ')}
      >
        <button
          type={abierta ? 'submit' : 'button'}
          onClick={() => !abierta && setAbierta(true)}
          aria-label="Buscar"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="search"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onBlur={() => !valor && setAbierta(false)}
          placeholder="Buscar en Notitec…"
          className={[
            'h-9 bg-transparent pr-3 text-sm outline-none placeholder:text-neutral-400',
            abierta ? 'w-full' : 'w-0 sm:w-full',
          ].join(' ')}
        />
      </div>
    </form>
  )
}
