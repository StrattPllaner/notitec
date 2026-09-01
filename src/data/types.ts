// ---------------------------------------------------------------------------
// Tipos de dominio de Notitec.
//
// Estos tipos describen la FORMA de los datos que consume la UI. La capa de
// acceso (noticias.ts, deportes.ts, ultimaHora.ts) es la única que sabe de
// dónde salen los datos. Si mañana se conecta una API real, estos tipos deben
// seguir describiendo lo que devuelven las funciones async: la UI no cambia.
// ---------------------------------------------------------------------------

/** Secciones editoriales del sitio. El valor es a la vez id y slug de ruta. */
export type Seccion =
  | 'nacional'
  | 'economia'
  | 'tecnologia'
  | 'cultura'
  | 'deportes'

/** Etiqueta legible (con acentos y mayúsculas) para cada sección. */
export interface SeccionInfo {
  slug: Seccion
  nombre: string
}

export interface Autor {
  id: string
  nombre: string
  /** Cargo o especialidad, p. ej. "Corresponsal en la CDMX". */
  rol: string
  avatarUrl: string
}

/** Una nota periodística. */
export interface Noticia {
  id: string
  titulo: string
  /** Entradilla / bajada: 1–2 oraciones de resumen. */
  entradilla: string
  seccion: Seccion
  autor: Autor
  /** Fecha de publicación en ISO 8601. */
  fechaISO: string
  /** URL de imagen de portada (placeholder por ahora). */
  imagenUrl: string
  /** Texto alternativo de la imagen. */
  imagenAlt: string
  /** Cuerpo del artículo como lista de párrafos. */
  cuerpo: string[]
  /** Minutos estimados de lectura. */
  minutosLectura: number
  /** Marca la nota principal de la portada. */
  destacada?: boolean
}

/** Titular breve para la franja de última hora. */
export interface UltimaHora {
  id: string
  texto: string
  /** Id de la noticia asociada, si existe. */
  noticiaId?: string
}

// ------------------------------- Deportes ---------------------------------

export interface Equipo {
  id: string
  nombre: string
  /** Abreviatura de 3 letras para marcadores compactos. */
  abreviatura: string
  escudoUrl: string
}

export type EstadoPartido = 'programado' | 'en-vivo' | 'medio-tiempo' | 'finalizado'

export interface Jugada {
  /** Minuto de la jugada. */
  minuto: number
  /** Descripción en texto de la jugada. */
  texto: string
  /** Tipo de evento, para iconografía/énfasis. */
  tipo: 'gol' | 'amarilla' | 'roja' | 'cambio' | 'ocasion' | 'inicio' | 'fin' | 'info'
  /** Equipo al que pertenece el evento (obligatorio en goles para el marcador en vivo). */
  equipo?: 'local' | 'visitante'
}

export interface EstadisticaPartido {
  etiqueta: string
  local: number
  visitante: number
  /** Si el valor se muestra con "%". */
  esPorcentaje?: boolean
}

export interface Partido {
  id: string
  competicion: string
  local: Equipo
  visitante: Equipo
  marcadorLocal: number
  marcadorVisitante: number
  estado: EstadoPartido
  /** Minuto actual si está en vivo. */
  minuto: number
  /** Fecha/hora de inicio en ISO 8601 (para calendario y partidos programados). */
  inicioISO: string
  /** Estadio o sede. */
  sede: string
  alineacionLocal: string[]
  alineacionVisitante: string[]
  estadisticas: EstadisticaPartido[]
  /** Narración jugada por jugada, de más reciente a más antigua. */
  narracion: Jugada[]
}
