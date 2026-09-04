import { useState } from 'react'
import type { Equipo } from '@/data/types'
import { useEquipos } from '@/hooks/useEquipos'
import { eliminarEquipo, guardarEquipo, nuevoId } from '@/data/adminWrites'

const INPUT =
  'h-10 w-full rounded-lg border border-neutral-300 bg-transparent px-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white'

const VACIO: Equipo = { id: '', nombre: '', abreviatura: '', escudoUrl: '' }

export function EditorEquipos() {
  const equipos = useEquipos()
  const [draft, setDraft] = useState<Equipo>(VACIO)
  const [guardando, setGuardando] = useState(false)

  function editar(e: Equipo) {
    setDraft({ ...e })
  }
  function nuevo() {
    setDraft({ ...VACIO })
  }

  async function guardar() {
    if (!draft.nombre.trim()) return
    setGuardando(true)
    try {
      const eq: Equipo = {
        ...draft,
        id: draft.id || nuevoId('eq'),
        abreviatura: (draft.abreviatura || draft.nombre.slice(0, 3)).toUpperCase(),
      }
      await guardarEquipo(eq)
      setDraft({ ...VACIO })
    } catch (err) {
      alert('No se pudo guardar: ' + (err as Error).message)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(id: string) {
    if (!confirm('¿Eliminar este equipo?')) return
    try {
      await eliminarEquipo(id)
      if (draft.id === id) setDraft({ ...VACIO })
    } catch (err) {
      alert('No se pudo eliminar: ' + (err as Error).message)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Formulario */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">{draft.id ? 'Editar equipo' : 'Nuevo equipo'}</h2>
        <div className="flex items-center gap-3">
          {draft.escudoUrl ? (
            <img src={draft.escudoUrl} alt="" className="h-14 w-14 rounded-full border border-neutral-200 object-cover dark:border-neutral-700" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800" />
          )}
          <div className="flex-1">
            <label className="text-xs font-medium">Foto / escudo (URL)</label>
            <input className={INPUT} value={draft.escudoUrl} onChange={(e) => setDraft({ ...draft, escudoUrl: e.target.value })} placeholder="https://…" />
          </div>
        </div>
        <label className="text-sm font-medium">
          Nombre
          <input className={INPUT} value={draft.nombre} onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} placeholder="Borregos CVA" />
        </label>
        <label className="text-sm font-medium">
          Abreviatura (3 letras)
          <input className={INPUT} value={draft.abreviatura} maxLength={4} onChange={(e) => setDraft({ ...draft, abreviatura: e.target.value })} placeholder="CVA" />
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={guardar} disabled={guardando} className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900">
            {guardando ? 'Guardando…' : draft.id ? 'Guardar' : 'Crear equipo'}
          </button>
          {draft.id && (
            <button type="button" onClick={nuevo} className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold dark:border-neutral-700">
              Cancelar
            </button>
          )}
        </div>
        <p className="text-xs text-neutral-400">
          Para subir una foto: súbela a un servicio (Google Fotos con enlace público, Imgur, etc.) y pega aquí el enlace directo a la imagen.
        </p>
      </div>

      {/* Lista */}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Equipos ({equipos.length})
        </h3>
        <ul className="flex max-h-[28rem] flex-col divide-y divide-neutral-200 overflow-y-auto dark:divide-neutral-800">
          {equipos.map((e) => (
            <li key={e.id} className="flex items-center gap-3 py-2">
              <img src={e.escudoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{e.nombre}</p>
                <p className="text-xs text-neutral-400">{e.abreviatura}</p>
              </div>
              <button type="button" onClick={() => editar(e)} className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Editar</button>
              <button type="button" onClick={() => borrar(e.id)} className="text-sm text-acento-600 dark:text-acento-400">Borrar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
