// Marca de Notitec: la imagen del logo tal cual la entregó el usuario, sin
// modificar. Solo se ajusta el tamaño de despliegue; el recorte circular
// coincide con la forma propia del logo.
const LOGO_URL = `${import.meta.env.BASE_URL}logo.png`

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <img
      src={LOGO_URL}
      alt="Notitec"
      width={size}
      height={size}
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  )
}
