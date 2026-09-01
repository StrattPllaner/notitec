import { Routes, Route } from 'react-router-dom'
import EnConstruccion from './pages/EnConstruccion'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EnConstruccion titulo="Portada" />} />
      <Route path="/seccion/:slug" element={<EnConstruccion titulo="Sección" />} />
      <Route path="/articulo/:id" element={<EnConstruccion titulo="Artículo" />} />
      <Route path="/partido/:id" element={<EnConstruccion titulo="Partido" />} />
      <Route path="/buscar" element={<EnConstruccion titulo="Búsqueda" />} />
      <Route path="*" element={<EnConstruccion titulo="Página no encontrada" />} />
    </Routes>
  )
}
