/**
 * Bloque de carga con brillo (shimmer). El shimmer se apaga solo vía la regla
 * global de prefers-reduced-motion en index.css.
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-neutral-200/80 dark:bg-neutral-800/80 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
    </div>
  )
}

/** Skeleton con la forma de una tarjeta de noticia (miniatura + textos). */
export function SkeletonTarjeta() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[16/10] w-full" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

/** Rejilla de skeletons para el estado de carga de una sección. */
export function SkeletonGrilla({ cantidad = 6 }: { cantidad?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cantidad }).map((_, i) => (
        <SkeletonTarjeta key={i} />
      ))}
    </div>
  )
}
