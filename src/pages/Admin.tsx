import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { app, db, ADMIN_EMAIL } from '@/lib/firebase'

const auth = getAuth(app)
import type { EstadoPartido, Jugada, Partido } from '@/data/types'
import { nombreDeporte, nombreTorneo } from '@/data/deportes'
import { usePartidos } from '@/hooks/usePartidos'
import { Logo } from '@/components/layout/Logo'

// ---- Login ---------------------------------------------------------------

function Login() {
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      setError(
        code.includes('configuration-not-found')
          ? 'Falta activar el inicio de sesión por Email/Password en la consola de Firebase.'
          : 'Correo o contraseña incorrectos.',
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={entrar} className="mx-auto mt-16 flex max-w-sm flex-col gap-4">
      <div className="flex items-center gap-2">
        <Logo size={36} />
        <div>
          <p className="font-serif text-xl font-bold leading-none">Notitec</p>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Panel de edición</p>
        </div>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo"
        autoComplete="username"
        className="h-11 rounded-lg border border-neutral-300 bg-transparent px-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
      />
      <input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Contraseña"
        autoComplete="current-password"
        className="h-11 rounded-lg border border-neutral-300 bg-transparent px-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
      />
      {error && <p className="text-sm text-acento-600 dark:text-acento-400">{error}</p>}
      <button
        type="submit"
        disabled={cargando}
        className="h-11 rounded-lg bg-neutral-900 font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
      >
        {cargando ? 'Entrando…' : 'Entrar'}
      </button>
      <Link to="/" className="text-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
        ← Volver al sitio
      </Link>
    </form>
  )
}

// ---- Editor de un partido -------------------------------------------------

const TIPOS: Jugada['tipo'][] = ['gol', 'amarilla', 'roja', 'cambio', 'ocasion', 'inicio', 'fin', 'info']
const ESTADOS: EstadoPartido[] = ['programado', 'en-vivo', 'medio-tiempo', 'finalizado']

function EditorPartido({ partido }: { partido: Partido }) {
  const [draft, setDraft] = useState<Partido>(partido)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  // Reinicia el borrador cuando cambia el partido seleccionado.
  useEffect(() => {
    setDraft(partido)
    setGuardado(false)
  }, [partido.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof Partido>(k: K, v: Partido[K]) {
    setDraft((d) => ({ ...d, [k]: v }))
    setGuardado(false)
  }

  function registrarGol(equipo: 'local' | 'visitante') {
    setDraft((d) => {
      const jugada: Jugada = {
        minuto: d.minuto,
        tipo: 'gol',
        equipo,
        texto: `Gol de ${equipo === 'local' ? d.local.nombre : d.visitante.nombre}`,
      }
      return {
        ...d,
        marcadorLocal: d.marcadorLocal + (equipo === 'local' ? 1 : 0),
        marcadorVisitante: d.marcadorVisitante + (equipo === 'visitante' ? 1 : 0),
        narracion: [jugada, ...d.narracion],
      }
    })
    setGuardado(false)
  }

  const [nueva, setNueva] = useState<Jugada>({ minuto: 0, tipo: 'info', texto: '' })

  function agregarJugada() {
    if (!nueva.texto.trim()) return
    setDraft((d) => ({ ...d, narracion: [{ ...nueva }, ...d.narracion] }))
    setNueva({ minuto: draft.minuto, tipo: 'info', texto: '' })
    setGuardado(false)
  }

  async function guardar() {
    setGuardando(true)
    setGuardado(false)
    try {
      await updateDoc(doc(db, 'partidos', draft.id), {
        estado: draft.estado,
        minuto: draft.minuto,
        marcadorLocal: draft.marcadorLocal,
        marcadorVisitante: draft.marcadorVisitante,
        alineacionLocal: draft.alineacionLocal,
        alineacionVisitante: draft.alineacionVisitante,
        narracion: draft.narracion,
      })
      setGuardado(true)
    } catch (err) {
      alert('No se pudo guardar: ' + (err as Error).message)
    } finally {
      setGuardando(false)
    }
  }

  const inputCls =
    'h-10 w-full rounded-lg border border-neutral-300 bg-transparent px-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          {nombreDeporte(draft.deporte)} · {nombreTorneo(draft.torneo)} · {draft.competicion}
        </p>
        <h2 className="mt-1 text-lg font-bold">
          {draft.local.nombre} vs {draft.visitante.nombre}
        </h2>
      </div>

      {/* Marcador */}
      <div className="grid grid-cols-2 gap-4">
        {(['local', 'visitante'] as const).map((lado) => {
          const campo = lado === 'local' ? 'marcadorLocal' : 'marcadorVisitante'
          const equipo = lado === 'local' ? draft.local : draft.visitante
          const valor = draft[campo]
          return (
            <div key={lado} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <p className="mb-2 truncate text-sm font-semibold">{equipo.nombre}</p>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => set(campo, Math.max(0, valor - 1))} className="h-10 w-10 rounded-lg border border-neutral-300 text-xl dark:border-neutral-700">−</button>
                <span className="w-8 text-center text-2xl font-bold tabular-nums">{valor}</span>
                <button type="button" onClick={() => set(campo, valor + 1)} className="h-10 w-10 rounded-lg border border-neutral-300 text-xl dark:border-neutral-700">+</button>
              </div>
              <button
                type="button"
                onClick={() => registrarGol(lado)}
                className="mt-3 w-full rounded-lg bg-neutral-900 py-2 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
              >
                Registrar gol
              </button>
            </div>
          )
        })}
      </div>

      {/* Minuto y estado */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Minuto
          <input
            type="number"
            value={draft.minuto}
            onChange={(e) => set('minuto', Number(e.target.value))}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Estado
          <select value={draft.estado} onChange={(e) => set('estado', e.target.value as EstadoPartido)} className={inputCls}>
            {ESTADOS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Alineaciones */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(['local', 'visitante'] as const).map((lado) => {
          const campo = lado === 'local' ? 'alineacionLocal' : 'alineacionVisitante'
          const equipo = lado === 'local' ? draft.local : draft.visitante
          return (
            <label key={lado} className="flex flex-col gap-1 text-sm font-medium">
              Alineación · {equipo.nombre} <span className="font-normal text-neutral-400">(uno por línea)</span>
              <textarea
                rows={11}
                value={draft[campo].join('\n')}
                onChange={(e) => set(campo, e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
                className="rounded-lg border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
              />
            </label>
          )
        })}
      </div>

      {/* Narración */}
      <div>
        <p className="mb-2 text-sm font-semibold">Agregar jugada</p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs">
            Min
            <input type="number" value={nueva.minuto} onChange={(e) => setNueva({ ...nueva, minuto: Number(e.target.value) })} className="h-10 w-16 rounded-lg border border-neutral-300 bg-transparent px-2 dark:border-neutral-700" />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            Tipo
            <select value={nueva.tipo} onChange={(e) => setNueva({ ...nueva, tipo: e.target.value as Jugada['tipo'] })} className="h-10 rounded-lg border border-neutral-300 bg-transparent px-2 dark:border-neutral-700">
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs">
            Equipo
            <select value={nueva.equipo ?? ''} onChange={(e) => setNueva({ ...nueva, equipo: (e.target.value || undefined) as Jugada['equipo'] })} className="h-10 rounded-lg border border-neutral-300 bg-transparent px-2 dark:border-neutral-700">
              <option value="">—</option>
              <option value="local">Local</option>
              <option value="visitante">Visitante</option>
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1 text-xs">
            Texto
            <input value={nueva.texto} onChange={(e) => setNueva({ ...nueva, texto: e.target.value })} placeholder="Descripción de la jugada" className="h-10 w-full min-w-[10rem] rounded-lg border border-neutral-300 bg-transparent px-3 dark:border-neutral-700" />
          </label>
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
        <button
          type="button"
          onClick={guardar}
          disabled={guardando}
          className="rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-60 dark:bg-white dark:text-neutral-900"
        >
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {guardado && <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">✓ Guardado — visible al instante</span>}
      </div>
    </div>
  )
}

// ---- Página ---------------------------------------------------------------

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [listoAuth, setListoAuth] = useState(false)
  const partidos = usePartidos()
  const [sel, setSel] = useState<string>('')

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setListoAuth(true)
    })
  }, [])

  if (!listoAuth) return <div className="p-10 text-center text-neutral-500">Cargando…</div>
  if (!user) return <Login />

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <p className="mb-4">La cuenta {user.email} no está autorizada para editar.</p>
        <button onClick={() => signOut(auth)} className="rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-700">Cerrar sesión</button>
      </div>
    )
  }

  const seleccionado = partidos.find((p) => p.id === sel) ?? partidos[0]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <h1 className="font-serif text-xl font-bold">Panel de edición</h1>
        </div>
        <button onClick={() => signOut(auth)} className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          Cerrar sesión
        </button>
      </div>

      <label className="mb-6 flex flex-col gap-1 text-sm font-medium">
        Partido a editar
        <select
          value={seleccionado?.id ?? ''}
          onChange={(e) => setSel(e.target.value)}
          className="h-11 rounded-lg border border-neutral-300 bg-transparent px-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
        >
          {partidos.map((p) => (
            <option key={p.id} value={p.id}>
              [{nombreDeporte(p.deporte)}/{nombreTorneo(p.torneo)}] {p.local.nombre} vs {p.visitante.nombre} — {p.estado}
            </option>
          ))}
        </select>
      </label>

      {seleccionado && <EditorPartido key={seleccionado.id} partido={seleccionado} />}
    </div>
  )
}
