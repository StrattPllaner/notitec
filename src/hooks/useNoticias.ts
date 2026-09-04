import { useEffect, useState } from 'react'
import type { Noticia } from '@/data/types'
import { getCacheNoticias, suscribirNoticias } from '@/data/noticiasStore'

/** Todas las noticias en tiempo real (se actualizan al editar desde /admin). */
export function useNoticias(): Noticia[] {
  const [noticias, setNoticias] = useState<Noticia[]>(getCacheNoticias)
  useEffect(() => suscribirNoticias(setNoticias), [])
  return noticias
}
