import { useState } from 'react'
import type { Noticia, Seccion } from '@/data/types'
import { SECCIONES } from '@/data/noticias'
import { useNoticias } from '@/hooks/useNoticias'
import { eliminarNoticia, guardarNoticia, nuevoId } from '@/data/adminWrites'
import { archivoADataUrl } from '@/lib/imagen'

const INPUT =
  'h-10 w-full rounded-lg border border-neutral-300 bg-transparent px-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white'
const AREA =
  'w-full rounded-lg border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white'

function noticiaVacia(): Noticia {
  return {
    id: '',
    titulo: '',
    entradilla: '',
    seccion: 'campus',
    autor: { id: 'redaccion', nombre: 'Redacción Daily-Tec', rol: 'Redacción', avatarUrl: 'https://i.pravatar.cc/120?img=5' },
    fechaISO: new Date().toISOString(),
    imagenUrl: '',
    imagenAlt: '',
    cuerpo: [],
    minutosLectura: 3,
    destacada: false,
  }
}

/** ISO → valor para <input type="datetime-local">. */
function isoALocal(iso: string): string {
  const d = new Date(iso)
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}

export function EditorNoticias() {
  const noticias = useNoticias()
  const [draft, setDraft] = useState<Noticia>(noticiaVacia())
  const [guardando, setGuardando] = useState(false)

  function set<K extends keyof Noticia>(k: K, v: Noticia[K]) {
    setDraft((d) => ({ ...d, [k]: v }))
  }
  function setAutor<K extends keyof Noticia['autor']>(k: K, v: Noticia['autor'][K]) {
    setDraft((d) => ({ ...d, autor: { ...d.autor, [k]: v } }))
  }

  async function guardar() {
    if (!draft.titulo.trim()) return
    setGuardando(true)
    try {
      const n: Noticia = {
        ...draft,
        id: draft.id || nuevoId('nota'),
        cuerpo: draft.cuerpo.map((s) => s.trim()).filter(Boolean),
      }
      await guardarNoticia(n)
      setDraft(noticiaVacia())
    } catch (err) {
      alert('No se pudo guardar: ' + (err as Error).message)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(id: string) {
    if (!confirm('¿Eliminar esta noticia?')) return
    try {
      await eliminarNoticia(id)
      if (draft.id === id) setDraft(noticiaVacia())
    } catch (err) {
      alert('No se pudo eliminar: ' + (err as Error).message)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Formulario */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">{draft.id ? 'Editar noticia' : 'Nueva noticia'}</h2>

        <label className="text-sm font-medium">
          Título
          <input className={INPUT} value={draft.titulo} onChange={(e) => set('titulo', e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Entradilla (resumen)
          <textarea className={AREA} rows={2} value={draft.entradilla} onChange={(e) => set('entradilla', e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">
            Sección
            <select className={INPUT} value={draft.seccion} onChange={(e) => set('seccion', e.target.value as Seccion)}>
              {SECCIONES.map((s) => (
                <option key={s.slug} value={s.slug}>{s.nombre}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Fecha
            <input
              type="datetime-local"
              className={INPUT}
              value={isoALocal(draft.fechaISO)}
              onChange={(e) => set('fechaISO', new Date(e.target.value).toISOString())}
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          {draft.imagenUrl ? (
            <img src={draft.imagenUrl} alt="" className="h-14 w-20 rounded-lg object-cover" />
          ) : (
            <div className="h-14 w-20 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          )}
          <div className="flex-1">
            <label className="text-xs font-medium">Imagen (pega una URL o sube una foto)</label>
            <input className={INPUT} value={draft.imagenUrl.startsWith('data:') ? '' : draft.imagenUrl} onChange={(e) => set('imagenUrl', e.target.value)} placeholder={draft.imagenUrl.startsWith('data:') ? 'Foto subida ✓' : 'https://…'} />
            <label className="mt-1 inline-block cursor-pointer text-xs font-semibold text-neutral-600 underline dark:text-neutral-300">
              Subir foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  if (f) set('imagenUrl', await archivoADataUrl(f, { maxAncho: 1280, mime: 'image/jpeg' }))
                }}
              />
            </label>
          </div>
        </div>
        <label className="text-sm font-medium">
          Texto alternativo de la imagen
          <input className={INPUT} value={draft.imagenAlt} onChange={(e) => set('imagenAlt', e.target.value)} />
        </label>

        <label className="text-sm font-medium">
          Cuerpo (un párrafo por línea)
          <textarea
            className={AREA}
            rows={7}
            value={draft.cuerpo.join('\n')}
            onChange={(e) => set('cuerpo', e.target.value.split('\n'))}
          />
        </label>

        <div className="grid grid-cols-3 gap-3">
          <label className="col-span-2 text-sm font-medium">
            Autor
            <input className={INPUT} value={draft.autor.nombre} onChange={(e) => setAutor('nombre', e.target.value)} />
          </label>
          <label className="text-sm font-medium">
            Min. lectura
            <input type="number" className={INPUT} value={draft.minutosLectura} onChange={(e) => set('minutosLectura', Number(e.target.value))} />
          </label>
        </div>
        <label className="text-sm font-medium">
          Rol del autor
          <input className={INPUT} value={draft.autor.rol} onChange={(e) => setAutor('rol', e.target.value)} />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={!!draft.destacada} onChange={(e) => set('destacada', e.target.checked)} className="h-4 w-4" />
          Nota principal de portada (destacada)
        </label>

        <div className="flex gap-2">
          <button type="button" onClick={guardar} disabled={guardando} className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900">
            {guardando ? 'Guardando…' : draft.id ? 'Guardar' : 'Publicar noticia'}
          </button>
          {draft.id && (
            <button type="button" onClick={() => setDraft(noticiaVacia())} className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold dark:border-neutral-700">
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Noticias ({noticias.length})
        </h3>
        <ul className="flex max-h-[34rem] flex-col divide-y divide-neutral-200 overflow-y-auto dark:divide-neutral-800">
          {[...noticias].sort((a, b) => new Date(b.fechaISO).getTime() - new Date(a.fechaISO).getTime()).map((n) => (
            <li key={n.id} className="flex items-center gap-3 py-2">
              <img src={n.imagenUrl} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{n.titulo}</p>
                <p className="text-xs text-neutral-400">
                  {n.seccion}{n.destacada ? ' · destacada' : ''}
                </p>
              </div>
              <button type="button" onClick={() => setDraft({ ...n })} className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Editar</button>
              <button type="button" onClick={() => borrar(n.id)} className="text-sm text-acento-600 dark:text-acento-400">Borrar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
