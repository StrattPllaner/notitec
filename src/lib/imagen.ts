// Convierte un archivo de imagen elegido por el usuario en un data URL,
// redimensionándolo y comprimiéndolo en el navegador para que quepa sin
// problema en Firestore (sin necesidad de un servicio de almacenamiento).

interface Opciones {
  maxAncho?: number
  /** 'image/jpeg' para fotos, 'image/png' para logos con transparencia. */
  mime?: 'image/jpeg' | 'image/png'
  calidad?: number
}

export function archivoADataUrl(
  file: File,
  { maxAncho = 1280, mime = 'image/jpeg', calidad = 0.82 }: Opciones = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'))
      img.onload = () => {
        const escala = Math.min(1, maxAncho / img.width)
        const w = Math.round(img.width * escala)
        const h = Math.round(img.height * escala)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('No se pudo procesar la imagen'))
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL(mime, calidad))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
