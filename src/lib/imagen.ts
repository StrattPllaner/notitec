// Convierte un archivo de imagen elegido por el usuario en un data URL,
// redimensionándolo y comprimiéndolo en el navegador para que quepa con holgura
// dentro de un documento de Firestore (límite duro de ~1 MB por documento) y
// así quede guardado en la nube, visible para todos, sin necesidad de un
// servicio de almacenamiento aparte.

interface Opciones {
  maxAncho?: number
  mime?: 'image/jpeg' | 'image/png'
  calidad?: number
  /** Tamaño máximo del data URL en caracteres (~bytes). Debajo de 1 MB. */
  limiteChars?: number
}

function dibujar(img: HTMLImageElement, ancho: number, mime: string, calidad: number): string {
  const escala = Math.min(1, ancho / img.width)
  const w = Math.round(img.width * escala)
  const h = Math.round(img.height * escala)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL(mime, calidad)
}

export function archivoADataUrl(
  file: File,
  { maxAncho = 1280, mime = 'image/jpeg', calidad = 0.82, limiteChars = 820_000 }: Opciones = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'))
      img.onload = () => {
        try {
          // Prueba combinaciones cada vez más pequeñas hasta caber en el límite.
          const anchos = [maxAncho, 1024, 800, 640, 480]
          const calidades = mime === 'image/png' ? [1] : [calidad, 0.7, 0.6, 0.5, 0.42]
          let mejor = dibujar(img, anchos[0], mime, calidades[0])
          for (const w of anchos) {
            for (const q of calidades) {
              const url = dibujar(img, w, mime, q)
              if (url.length <= limiteChars) {
                resolve(url)
                return
              }
              if (url.length < mejor.length) mejor = url
            }
          }
          // Si ninguna combinación bajó del límite, usa la más pequeña lograda.
          resolve(mejor)
        } catch (e) {
          reject(e as Error)
        }
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
