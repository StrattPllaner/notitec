// ---------------------------------------------------------------------------
// Fuente de datos de EQUIPOS en tiempo real (Firestore) con respaldo local.
//
// Colección `equipos`: catálogo de equipos (nombre, abreviatura, escudo/foto)
// que el panel /admin puede gestionar y que se usan al crear partidos.
// El respaldo local se deriva de los equipos presentes en los partidos.
// ---------------------------------------------------------------------------

import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Equipo, Partido } from './types'
import partidosRaw from './fuentes/partidos.json'

function equiposLocales(): Equipo[] {
  const mapa = new Map<string, Equipo>()
  for (const p of partidosRaw as Partido[]) {
    for (const e of [p.local, p.visitante]) {
      if (!mapa.has(e.id)) mapa.set(e.id, e)
    }
  }
  return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre))
}

type Listener = (equipos: Equipo[]) => void

let cache: Equipo[] = equiposLocales()
let iniciado = false
const listeners = new Set<Listener>()

function emitir() {
  for (const l of listeners) l(cache)
}

function iniciar() {
  if (iniciado) return
  iniciado = true
  try {
    onSnapshot(
      collection(db, 'equipos'),
      (snap) => {
        if (snap.empty) return
        cache = snap.docs
          .map((d) => d.data() as Equipo)
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
        emitir()
      },
      (err) => console.warn('Daily-Tec · Firestore equipos no disponible:', err.message),
    )
  } catch (err) {
    console.warn('Daily-Tec · no se pudo iniciar Firestore (equipos):', err)
  }
}

export function suscribirEquipos(cb: Listener): () => void {
  iniciar()
  cb(cache)
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function getCacheEquipos(): Equipo[] {
  iniciar()
  return cache
}
