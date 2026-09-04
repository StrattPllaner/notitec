// ---------------------------------------------------------------------------
// Escrituras del panel /admin a Firestore. Solo funcionan para la cuenta
// administradora (lo imponen las reglas de seguridad). Los cambios se reflejan
// al instante en el sitio gracias a las suscripciones onSnapshot.
// ---------------------------------------------------------------------------

import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Equipo, Noticia, Partido } from './types'

/** Genera un id nuevo con un prefijo legible. */
export function nuevoId(prefijo: string): string {
  const rnd =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefijo}-${rnd}`
}

export function guardarPartido(p: Partido): Promise<void> {
  return setDoc(doc(db, 'partidos', p.id), p)
}
export function eliminarPartido(id: string): Promise<void> {
  return deleteDoc(doc(db, 'partidos', id))
}

export function guardarNoticia(n: Noticia): Promise<void> {
  return setDoc(doc(db, 'noticias', n.id), n)
}
export function eliminarNoticia(id: string): Promise<void> {
  return deleteDoc(doc(db, 'noticias', id))
}

export function guardarEquipo(e: Equipo): Promise<void> {
  return setDoc(doc(db, 'equipos', e.id), e)
}
export function eliminarEquipo(id: string): Promise<void> {
  return deleteDoc(doc(db, 'equipos', id))
}
