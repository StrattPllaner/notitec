import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Logo } from '@/components/layout/Logo'
import { EditorPartidos } from './admin/EditorPartidos'
import { EditorNoticias } from './admin/EditorNoticias'
import { EditorEquipos } from './admin/EditorEquipos'

type Pestana = 'partidos' | 'noticias' | 'equipos'

const PESTANAS: { id: Pestana; nombre: string }[] = [
  { id: 'partidos', nombre: 'Partidos' },
  { id: 'noticias', nombre: 'Noticias' },
  { id: 'equipos', nombre: 'Equipos' },
]

export default function Admin() {
  const { user, listo, esAdmin } = useAuth()
  const [tab, setTab] = useState<Pestana>('partidos')

  if (!listo) return <div className="p-10 text-center text-neutral-500">Cargando…</div>

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Logo size={40} />
        <h1 className="mt-4 font-serif text-2xl font-bold">Panel de edición</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Inicia sesión con el botón de cuenta (arriba a la derecha) para editar el sitio.
        </p>
      </div>
    )
  }

  if (!esAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p>La cuenta {user.email} no está autorizada para editar.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Logo size={32} />
        <h1 className="font-serif text-xl font-bold">Panel de edición</h1>
      </div>

      <div className="mb-8 flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setTab(p.id)}
            className={[
              '-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors',
              tab === p.id
                ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            ].join(' ')}
          >
            {p.nombre}
          </button>
        ))}
      </div>

      {tab === 'partidos' && <EditorPartidos />}
      {tab === 'noticias' && <EditorNoticias />}
      {tab === 'equipos' && <EditorEquipos />}
    </div>
  )
}
