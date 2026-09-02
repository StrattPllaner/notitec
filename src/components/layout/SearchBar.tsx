import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * Barra de búsqueda. Al enviar, navega a /buscar?q=... (una de las cuatro
 * acciones del sitio).
 *
 * - variant "inline" (escritorio): icono que se despliega en un campo compacto.
 * - variant "full" (menú móvil): campo completo siempre visible, cómodo al tacto.
 */
export function SearchBar({
  variant = 'inline',
  onEnviar,
}: {
  variant?: 'inline' | 'full'
  onEnviar?: () => void
}) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const esFull = variant === 'full'
  const [abierta, setAbierta] = useState(esFull)
  const [valor, setValor] = useState(params.get('q') ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (abierta && !esFull) inputRef.current?.focus()
  }, [abierta, esFull])

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const q = valor.trim()
    if (!q) return
    navigate(`/buscar?q=${encodeURIComponent(q)}`)
    if (!esFull) setAbierta(false)
    onEnviar?.()
  }

  return (
    <form onSubmit={enviar} className={esFull ? 'w-full' : 'flex items-center'} role="search">
      <div
        className={[
          'flex items-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 transition-all dark:border-neutral-700 dark:bg-neutral-900',
          esFull ? 'w-full' : abierta ? 'w-56' : 'w-11 sm:w-56',
        ].join(' ')}
      >
        <button
          type={abierta ? 'submit' : 'button'}
          onClick={() => !abierta && setAbierta(true)}
          aria-label="Buscar"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="search"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onBlur={() => !esFull && !valor && setAbierta(false)}
          placeholder="Buscar en Notitec…"
          className={[
            'h-11 bg-transparent pr-3 text-base outline-none placeholder:text-neutral-400 sm:text-sm',
            esFull || abierta ? 'w-full' : 'w-0 sm:w-full',
          ].join(' ')}
        />
      </div>
    </form>
  )
}
