/**
 * Convierte una fecha ISO en un texto relativo en español de México,
 * p. ej. "hace 2 h", "hace 5 min", "ayer".
 *
 * Recibe opcionalmente `ahora` para pruebas deterministas.
 */
export function tiempoRelativo(fechaISO: string, ahora: Date = new Date()): string {
  const fecha = new Date(fechaISO)
  const segundos = Math.round((ahora.getTime() - fecha.getTime()) / 1000)

  if (segundos < 45) return 'hace un momento'
  const minutos = Math.round(segundos / 60)
  if (minutos < 60) return `hace ${minutos} min`
  const horas = Math.round(minutos / 60)
  if (horas < 24) return `hace ${horas} h`
  const dias = Math.round(horas / 24)
  if (dias === 1) return 'ayer'
  if (dias < 7) return `hace ${dias} días`

  return fecha.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
  })
}

/** Fecha larga legible, p. ej. "1 de septiembre de 2026". */
export function fechaLarga(fechaISO: string): string {
  return new Date(fechaISO).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Hora corta, p. ej. "18:30". */
export function horaCorta(fechaISO: string): string {
  return new Date(fechaISO).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
