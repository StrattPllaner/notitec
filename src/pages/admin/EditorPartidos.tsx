import { useState } from 'react'
import type { Deporte, EstadoPartido, Equipo, Jugada, Partido, Torneo } from '@/data/types'
import { DEPORTES, nombreDeporte, nombreTorneo, TORNEOS } from '@/data/deportes'
import { usePartidos } from '@/hooks/usePartidos'
import { useEquipos } from '@/hooks/useEquipos'
import { eliminarPartido, guardarPartido, nuevoId } from '@/data/adminWrites'

const INPUT =
  'h-10 w-full rounded-lg border border-neutral-300 bg-transparent px-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white'

const TIPOS: Jugada['tipo'][] = ['gol', 'amarilla', 'roja', 'cambio', 'ocasion', 'inicio', 'fin', 'info']
const ESTADOS: EstadoPartido[] = ['programado', 'en-vivo', 'medio-tiempo', 'finalizado']

function partidoVacio(equipos: Equipo[]): Partido {
  const vacio: Equipo = { id: '', nombre: '', abreviatura: '', escudoUrl: '' }
  return {
    id: '',
    competicion: 'Liga Intercampus',
    deporte: 'futbol',
    torneo: 'representativo',
    local: equipos[0] ?? vacio,
    visitante: equipos[1] ?? vacio,
    marcadorLocal: 0,
    marcadorVisitante: 0,
    estado: 'programado',
    minuto: 0,
    inicioISO: new Date().toISOString(),
    sede: '',
    alineacionLocal: [],
    alineacionVisitante: [],
    estadisticas: [],
    narracion: [],
  }
}

function isoALocal(iso: string): string {
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export function EditorPartidos() {
  const partidos = usePartidos()
  const equipos = useEquipos()
  const [draft, setDraft] = useState<Partido>(() => partidoVacio(equipos))
  const [guardando, setGuardando] = useState(false)
  const [ok, setOk] = useState(false)
  const [nueva, setNueva] = useState<Jugada>({ minuto: 0, tipo: 'info', texto: '' })

  function set<K extends keyof Partido>(k: K, v: Partido[K]) {
    setDraft((d) => ({ ...d, [k]: v }))
    setOk(false)
  }
  function setEquipo(lado: 'local' | 'visitante', id: string) {
    const eq = equipos.find((e) => e.id === id)
    if (eq) set(lado, eq)
  }
  function registrarGol(lado: 'local' | 'visitante') {
    setDraft((d) => ({
      ...d,
      marcadorLocal: d.marcadorLocal + (lado === 'local' ? 1 : 0),
      marcadorVisitante: d.marcadorVisitante + (lado === 'visitante' ? 1 : 0),
      narracion: [
        { minuto: d.minuto, tipo: 'gol', equipo: lado, texto: `Gol de ${lado === 'local' ? d.local.nombre : d.visitante.nombre}` },
        ...d.narracion,
      ],
    }))
    setOk(false)
  }
  function agregarJugada() {
    if (!nueva.texto.trim()) return
    setDraft((d) => ({ ...d, narracion: [{ ...nueva }, ...d.narracion] }))
    setNueva({ minuto: draft.minuto, tipo: 'info', texto: '' })
    setOk(false)
  }

  async function guardar() {
    if (!draft.local.nombre || !draft.visitante.nombre) {
      alert('Elige los dos equipos.')
      return
    }
    setGuardando(true)
    setOk(false)
    try {
      const limpiar = (a: string[]) => a.map((s) => s.trim()).filter(Boolean)
      const p: Partido = {
        ...draft,
        id: draft.id || nuevoId('par'),
        alineacionLocal: limpiar(draft.alineacionLocal),
        alineacionVisitante: limpiar(draft.alineacionVisitante),
        transmisionUrl: (draft.transmisionUrl ?? '').trim(),
      }
      await guardarPartido(p)
      setDraft(p)
      setOk(true)
    } catch (err) {
      alert('No se pudo guardar: ' + (err as Error).message)
    } finally {
      setGuardando(false)
    }
  }
  async function borrar() {
    if (!draft.id || !confirm('¿Eliminar este partido?')) return
    try {
      await eliminarPartido(draft.id)
      setDraft(partidoVacio(equipos))
    } catch (err) {
      alert('No se pudo eliminar: ' + (err as Error).message)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Selector */}
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex-1 text-sm font-medium">
          Partido
          <select
            className={INPUT}
            value={draft.id}
            onChange={(e) => {
              const p = partidos.find((x) => x.id === e.target.value)
              setDraft(p ? { ...p } : partidoVacio(equipos))
              setOk(false)
            }}
          >
            <option value="">➕ Nuevo partido…</option>
            {partidos.map((p) => (
              <option key={p.id} value={p.id}>
                [{nombreDeporte(p.deporte)}/{nombreTorneo(p.torneo)}] {p.local.nombre} vs {p.visitante.nombre} — {p.estado}
              </option>
            ))}
          </select>
        </label>
        {draft.id && (
          <button type="button" onClick={borrar} className="rounded-lg border border-acento-400 px-4 py-2.5 text-sm font-semibold text-acento-600 dark:text-acento-400">
            Eliminar
          </button>
        )}
      </div>

      {/* Clasificación */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="text-sm font-medium">
          Deporte
          <select className={INPUT} value={draft.deporte} onChange={(e) => set('deporte', e.target.value as Deporte)}>
            {DEPORTES.map((d) => <option key={d.slug} value={d.slug}>{d.nombre}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          Torneo
          <select className={INPUT} value={draft.torneo} onChange={(e) => set('torneo', e.target.value as Torneo)}>
            {TORNEOS.map((t) => <option key={t.slug} value={t.slug}>{t.nombre}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          Estado
          <select className={INPUT} value={draft.estado} onChange={(e) => set('estado', e.target.value as EstadoPartido)}>
            {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          Minuto
          <input type="number" className={INPUT} value={draft.minuto} onChange={(e) => set('minuto', Number(e.target.value))} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Competición
          <input className={INPUT} value={draft.competicion} onChange={(e) => set('competicion', e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Sede
          <input className={INPUT} value={draft.sede} onChange={(e) => set('sede', e.target.value)} />
        </label>
      </div>
      <label className="text-sm font-medium">
        Fecha y hora
        <input type="datetime-local" className={INPUT} value={isoALocal(draft.inicioISO)} onChange={(e) => set('inicioISO', new Date(e.target.value).toISOString())} />
      </label>
      <label className="text-sm font-medium">
        Transmisión en vivo (enlace de YouTube, Twitch, etc.) <span className="font-normal text-neutral-400">— opcional</span>
        <input
          className={INPUT}
          value={draft.transmisionUrl ?? ''}
          onChange={(e) => set('transmisionUrl', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </label>

      {/* Equipos + marcador */}
      <div className="grid grid-cols-2 gap-4">
        {(['local', 'visitante'] as const).map((lado) => {
          const eq = draft[lado]
          const campo = lado === 'local' ? 'marcadorLocal' : 'marcadorVisitante'
          const valor = draft[campo]
          return (
            <div key={lado} className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
              <p className="mb-1 text-xs uppercase tracking-wide text-neutral-400">{lado}</p>
              <select className={INPUT} value={eq.id} onChange={(e) => setEquipo(lado, e.target.value)}>
                <option value={eq.id}>{eq.nombre || 'Elegir equipo'}</option>
                {equipos.filter((e) => e.id !== eq.id).map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
              <div className="mt-3 flex items-center gap-2">
                <button type="button" onClick={() => set(campo, Math.max(0, valor - 1))} className="h-9 w-9 rounded-lg border border-neutral-300 text-lg dark:border-neutral-700">−</button>
                <span className="w-8 text-center text-2xl font-bold tabular-nums">{valor}</span>
                <button type="button" onClick={() => set(campo, valor + 1)} className="h-9 w-9 rounded-lg border border-neutral-300 text-lg dark:border-neutral-700">+</button>
                <button type="button" onClick={() => registrarGol(lado)} className="ml-auto rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900">+ Gol</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alineaciones */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(['local', 'visitante'] as const).map((lado) => {
          const campo = lado === 'local' ? 'alineacionLocal' : 'alineacionVisitante'
          return (
            <label key={lado} className="text-sm font-medium">
              Alineación · {draft[lado].nombre || lado} <span className="font-normal text-neutral-400">(uno por línea)</span>
              <textarea
                rows={9}
                value={draft[campo].join('\n')}
                onChange={(e) => set(campo, e.target.value.split('\n'))}
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-transparent p-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
              />
            </label>
          )
        })}
      </div>

      {/* Narración */}
      <div>
        <p className="mb-2 text-sm font-semibold">Agregar jugada</p>
        <div className="flex flex-wrap items-end gap-2">
          <input type="number" value={nueva.minuto} onChange={(e) => setNueva({ ...nueva, minuto: Number(e.target.value) })} className="h-10 w-16 rounded-lg border border-neutral-300 bg-transparent px-2 dark:border-neutral-700" placeholder="Min" />
          <select value={nueva.tipo} onChange={(e) => setNueva({ ...nueva, tipo: e.target.value as Jugada['tipo'] })} className="h-10 rounded-lg border border-neutral-300 bg-transparent px-2 dark:border-neutral-700">
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input value={nueva.texto} onChange={(e) => setNueva({ ...nueva, texto: e.target.value })} placeholder="Descripción" className="h-10 flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 dark:border-neutral-700" />
          <button type="button" onClick={agregarJugada} className="h-10 rounded-lg border border-neutral-300 px-4 text-sm font-semibold dark:border-neutral-700">Agregar</button>
        </div>
        <ul className="mt-3 max-h-40 overflow-y-auto text-sm text-neutral-600 dark:text-neutral-300">
          {draft.narracion.map((j, i) => (
            <li key={i} className="border-b border-neutral-100 py-1 dark:border-neutral-800">
              <span className="font-bold tabular-nums">{j.minuto}&apos;</span> [{j.tipo}] {j.texto}
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky bottom-4 flex items-center gap-3">
        <button type="button" onClick={guardar} disabled={guardando} className="rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-60 dark:bg-white dark:text-neutral-900">
          {guardando ? 'Guardando…' : draft.id ? 'Guardar cambios' : 'Crear partido'}
        </button>
        {ok && <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">✓ Guardado — visible al instante</span>}
      </div>
    </div>
  )
}
