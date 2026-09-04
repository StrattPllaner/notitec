# Notitec

Sitio web del medio de noticias estudiantil del **Tec de Monterrey, Campus
Cuernavaca (CVA)**. Portada, secciones (Campus, Académico, Estudiantil, Cultura
y Deportes), vista de artículo, marcadores de los Borregos en vivo con narración
jugada por jugada, búsqueda y compartir. Modo claro/oscuro, identidad en blanco
y negro.

> Proyecto de demostración con contenido simulado; no es un medio oficial del
> Tecnológico de Monterrey.

Todos los datos son **simulados** y viven detrás de una capa de acceso en
`src/data/`. La interfaz nunca lee el JSON directamente: siempre pasa por
funciones asíncronas, de modo que conectar una API real no requiere tocar la UI.

## Stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- Tailwind CSS (modo oscuro por clase)
- React Router
- Framer Motion (única librería de animación)

Sin backend, sin librerías de UI ni de estado global.

## Cómo correr el proyecto

Requiere Node 18+ (probado con Node 24).

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
```

Otros comandos:

```bash
npm run build    # verifica tipos (tsc) y genera el build de producción en dist/
npm run preview  # sirve el build de producción localmente
npm run lint     # ESLint (sin warnings permitidos)
```

> Nota sobre npm: este repo incluye un `.npmrc` (ignorado por git) que apunta la
> caché de npm a una ruta local, por un problema de permisos de la máquina de
> desarrollo. En una máquina normal puedes borrar `.npmrc` sin consecuencias.

## Estructura

```
src/
├── data/            → capa de acceso a datos (la única puerta a los datos)
│   ├── types.ts        tipos de dominio (Noticia, Partido, Autor, …)
│   ├── noticias.ts     funciones de notas: portada, secciones, artículo, búsqueda
│   ├── deportes.ts     partidos en vivo (simulados), calendario, crónicas
│   ├── ultimaHora.ts   titulares de la franja de última hora
│   ├── fuentes/        JSON simulado (noticias, partidos, autores)
│   └── utils/          latencia simulada y formato de fechas
├── components/      → UI reutilizable (layout, noticias, deportes, primitivas)
├── hooks/           → useAsync, useTema, useReducedMotion, sondeo en vivo, …
├── layouts/         → SiteLayout (header + footer + transición de rutas)
├── pages/           → Portada, secciones, Artículo, PartidoDetalle, Búsqueda, 404
└── lib/             → constantes (colores por sección)
```

## Conectar una API real

Toda la obtención de datos está aislada en tres archivos:
`src/data/noticias.ts`, `src/data/deportes.ts` y `src/data/ultimaHora.ts`.
Los componentes solo consumen sus funciones exportadas; **no** conocen el origen
de los datos. Para conectar una API real, reescribe el **cuerpo** de esas
funciones sin cambiar su firma ni los tipos de `src/data/types.ts`.

Concretamente:

1. **Elimina los `import ... from './fuentes/*.json'`** y la llamada a
   `delay()` (esa utilidad solo simula la latencia de red).

2. **Reemplaza cada cuerpo por un `fetch`** que devuelva el mismo tipo. Por
   ejemplo, en `src/data/noticias.ts`:

   ```ts
   // Antes (simulado):
   export async function getArticulo(id: string): Promise<Noticia | null> {
     await delay()
     return noticias.find((n) => n.id === id) ?? null
   }

   // Después (API real):
   export async function getArticulo(id: string): Promise<Noticia | null> {
     const res = await fetch(`${API_URL}/noticias/${id}`)
     if (res.status === 404) return null
     if (!res.ok) throw new Error('No se pudo cargar la nota')
     return (await res.json()) as Noticia
   }
   ```

3. **Ajusta el "join" autor↔nota si tu API ya lo resuelve.** Hoy el JSON guarda
   `autorId` y `hidratar()` en `noticias.ts` incrusta el autor. Si tu endpoint ya
   devuelve el objeto `autor` completo, elimina `hidratar()` y devuelve la
   respuesta tal cual.

4. **Partidos en vivo:** la función `simular()` en `deportes.ts` calcula minuto y
   marcador a partir del reloj para que la demo "se sienta viva". Con una API
   real, elimínala: el endpoint ya devolverá el marcador y el minuto actuales.
   El sondeo cada 15 s vive en los hooks (`usePartidosEnVivo`, `usePartido`) y no
   necesita cambios.

Mientras el tipo devuelto siga cumpliendo `src/data/types.ts`, ninguna página ni
componente necesita modificarse.

## Marcadores en tiempo real y panel de edición

Los partidos viven en **Firestore** (proyecto `notitec-cva`). El sitio los lee
en tiempo real con `onSnapshot`: cuando la cuenta administradora edita un
marcador o una alineación desde `/admin`, el cambio aparece al instante en todos
los dispositivos que estén viendo la página. Si Firestore no responde, el sitio
cae al JSON local (`src/data/fuentes/partidos.json`) y sigue funcionando.

- Configuración pública del cliente: `src/lib/firebase.ts`.
- Suscripción en tiempo real: `src/data/partidosStore.ts`.
- Reglas de seguridad: `firestore.rules` (lectura pública; escritura solo para
  el correo administrador). Se despliegan con
  `firebase deploy --only firestore:rules`.
- Panel de edición: `src/pages/Admin.tsx`, ruta `/admin` (login con Firebase
  Auth; edita marcador, minuto, estado, alineaciones y jugadas).

**Paso manual pendiente (una vez):** en la consola de Firebase →
Authentication → Comenzar → habilitar *Correo electrónico/contraseña*, y agregar
`strattpllaner.github.io` a los dominios autorizados. Después, crear el usuario
administrador con el correo definido en `ADMIN_EMAIL`.

## Alcance intencional

Las únicas acciones del sitio son: navegar entre secciones, abrir una nota,
buscar y compartir. No hay login, suscripción, favoritos, newsletter,
comentarios ni panel de configuración, por decisión de diseño.

## Accesibilidad y movimiento

Las animaciones (entrada escalonada de tarjetas, hover, transición de rutas,
contador del marcador, subrayado de navegación, skeletons) duran entre 150 y
300 ms. Nada se anima en bucle dentro del área de lectura y el cuerpo de los
artículos no lleva animación. Todo respeta `prefers-reduced-motion`: con esa
preferencia activada, el movimiento no esencial se desactiva.
