// ---------------------------------------------------------------------------
// Fuente de datos de PARTIDOS en tiempo real.
//
// Se suscribe a la colección `partidos` de Firestore con onSnapshot: cuando la
// cuenta administradora edita un marcador o una alineación desde /admin, el
// cambio llega al instante a todos los que estén viendo el sitio.
//
// Si Firestore no está disponible, cae al JSON local incluido en el bundle,
// de modo que el sitio nunca se queda sin datos.
// ---------------------------------------------------------------------------

import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Partido } from './types'
import localPartidos from './fuentes/partidos.json'

type Listener = (partidos: Partido[]) => void

// Caché en memoria; arranca con los datos locales como respaldo inmediato.
let cache: Partido[] = localPartidos as Partido[]
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
      collection(db, 'partidos'),
      (snap) => {
        if (snap.empty) return // conserva el respaldo local si no hay datos
        cache = snap.docs.map((d) => d.data() as Partido)
        emitir()
      },
      (err) => {
        // Error de permisos/red: se mantiene el respaldo local.
        console.warn('Notitec · Firestore partidos no disponible:', err.message)
      },
    )
  } catch (err) {
    console.warn('Notitec · no se pudo iniciar Firestore:', err)
  }
}

/**
 * Suscribe un callback a los partidos. Llama de inmediato con el valor actual
 * (caché) y de nuevo cada vez que Firestore emite cambios. Devuelve una función
 * para cancelar la suscripción.
 */
export function suscribirPartidos(cb: Listener): () => void {
  iniciar()
  cb(cache)
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/** Valor actual de la caché (sin suscribirse). */
export function getCachePartidos(): Partido[] {
  return cache
}
