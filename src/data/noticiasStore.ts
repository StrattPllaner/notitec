// ---------------------------------------------------------------------------
// Fuente de datos de NOTICIAS en tiempo real (Firestore) con respaldo local.
//
// Cada noticia se guarda como documento en la colección `noticias`, con el
// autor embebido (denormalizado) para que el panel /admin pueda editar todo en
// un solo lugar. Si Firestore no está disponible, se usa el JSON local.
// ---------------------------------------------------------------------------

import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Autor, Noticia, Seccion } from './types'
import noticiasRaw from './fuentes/noticias.json'
import autoresRaw from './fuentes/autores.json'

interface NoticiaRaw {
  id: string
  titulo: string
  entradilla: string
  seccion: Seccion
  autorId: string
  fechaISO: string
  imagenUrl: string
  imagenAlt: string
  minutosLectura: number
  cuerpo: string[]
  destacada?: boolean
}

const autores = autoresRaw as Autor[]

/** Resuelve la relación noticia→autor para el respaldo local. */
function hidratar(raw: NoticiaRaw): Noticia {
  const autor =
    autores.find((a) => a.id === raw.autorId) ?? {
      id: 'desconocido',
      nombre: 'Redacción Daily-Tec',
      rol: 'Redacción',
      avatarUrl: 'https://i.pravatar.cc/120?img=1',
    }
  const { autorId, ...resto } = raw
  return { ...resto, autor }
}

type Listener = (noticias: Noticia[]) => void

let cache: Noticia[] = (noticiasRaw as NoticiaRaw[]).map(hidratar)
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
      collection(db, 'noticias'),
      (snap) => {
        if (snap.empty) return
        cache = snap.docs.map((d) => d.data() as Noticia)
        emitir()
      },
      (err) => console.warn('Daily-Tec · Firestore noticias no disponible:', err.message),
    )
  } catch (err) {
    console.warn('Daily-Tec · no se pudo iniciar Firestore (noticias):', err)
  }
}

export function suscribirNoticias(cb: Listener): () => void {
  iniciar()
  cb(cache)
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function getCacheNoticias(): Noticia[] {
  iniciar()
  return cache
}
