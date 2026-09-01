import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-serif text-6xl font-bold text-acento-600 dark:text-acento-400">404</p>
      <h1 className="mt-4 text-2xl font-bold">Página no encontrada</h1>
      <p className="mt-2 text-neutral-500 dark:text-neutral-400">
        La nota o sección que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-acento-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-acento-700"
      >
        Ir a la portada
      </Link>
    </div>
  )
}
