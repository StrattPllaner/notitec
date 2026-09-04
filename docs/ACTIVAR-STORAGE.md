# Activar fotos en alta calidad (Firebase Storage)

Guía para pasar de las fotos comprimidas (guardadas dentro de la base de datos,
plan gratis) a **Firebase Storage**, donde cada foto tiene su propio enlace y no
hay límite de tamaño. Proyecto: **notitec-cva**.

## Parte 1 — Lo que haces tú en la consola (una sola vez)

1. **Activar el plan Blaze (pago por uso):**
   - Entra a https://console.firebase.google.com/project/notitec-cva/usage/details
   - Clic en **"Modificar plan"** → elige **Blaze** → vincula una cuenta de
     facturación de Google Cloud (pide una tarjeta).
   - Blaze tiene una cuota gratis mensual generosa; para un medio de campus lo
     normal es no pagar nada. Aun así, en Google Cloud puedes poner un
     **presupuesto con alerta** (p. ej. $1 USD) para que te avise si algo se
     dispara: https://console.cloud.google.com/billing → Presupuestos y alertas.

2. **Crear el almacén (Storage):**
   - Entra a https://console.firebase.google.com/project/notitec-cva/storage
   - Clic en **"Comenzar"** → deja **"modo de producción"** (las reglas las
     configuro yo después) → elige ubicación (p. ej. `us-central1` o `nam5`) →
     Listo.

## Parte 2 — Lo que hago yo después (avísame cuando termines la Parte 1)

3. Despliego las reglas de Storage: lectura pública, escritura solo para tu
   cuenta admin (igual que en la base de datos).
4. Cambio la subida del panel `/admin` para que:
   - suba el archivo original a Storage,
   - guarde en la noticia/equipo el **enlace público** de la foto (en vez de la
     versión comprimida incrustada).
5. Verifico que las fotos en alta calidad se vean para todos y que las páginas
   queden ligeras.

## Mientras tanto (plan gratis, ya funciona)

No necesitas nada de lo anterior para que las fotos se compartan: sube la foto
en `/admin`, **presiona Guardar/Publicar**, y queda en la nube para todos. La
única diferencia es que en el plan gratis la foto se guarda optimizada (tamaño
moderado), suficiente para logos y fotos de notas.
