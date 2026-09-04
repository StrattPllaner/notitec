import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Configuración web de Firebase del proyecto `notitec-cva`.
// Nota: la apiKey de una app WEB de Firebase NO es un secreto; es un
// identificador público. La seguridad la imponen las reglas de Firestore
// (lectura pública, escritura solo para la cuenta administradora) y Auth.
const firebaseConfig = {
  apiKey: 'AIzaSyAoHe8NG8Q0N0WH19X2F-RyFOTc7mcToco',
  authDomain: 'notitec-cva.firebaseapp.com',
  projectId: 'notitec-cva',
  storageBucket: 'notitec-cva.firebasestorage.app',
  messagingSenderId: '752547074144',
  appId: '1:752547074144:web:93ed0405a9bbf9f3f2b305',
}

export const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

/** Correo de la cuenta autorizada a editar (debe coincidir con firestore.rules). */
export const ADMIN_EMAIL = 'carretoleonardo2312@gmail.com'
