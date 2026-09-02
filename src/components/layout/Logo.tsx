/**
 * Marca de Notitec: el "moño" del logo dentro de un contenedor redondeado.
 * Monocromo que invierte con el tema (negro con moño blanco en claro, blanco
 * con moño negro en oscuro).
 */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <path d="M4 5 L4 19 L12 12 Z" />
        <path d="M20 5 L20 19 L12 12 Z" />
      </svg>
    </span>
  )
}
