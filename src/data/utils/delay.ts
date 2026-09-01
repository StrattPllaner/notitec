/**
 * Simula la latencia de una llamada de red. Al conectar una API real, esta
 * utilidad desaparece: las funciones de la capa de datos harán `await fetch(...)`
 * en lugar de `await delay(...)`.
 */
export function delay(ms = 320): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
