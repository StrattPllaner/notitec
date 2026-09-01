// Página provisional usada durante el desarrollo por etapas.
// Se reemplaza por el contenido real de cada sección en las etapas siguientes.
export default function EnConstruccion({ titulo }: { titulo: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-acento-600 dark:text-acento-400">
        Notitec
      </p>
      <h1 className="mt-3 text-2xl font-bold">{titulo}</h1>
      <p className="mt-2 text-neutral-500 dark:text-neutral-400">
        Sección en construcción.
      </p>
    </div>
  )
}
