import { Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout'
import Portada from './pages/Portada'
import EnConstruccion from './pages/EnConstruccion'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Portada />} />
        <Route path="/seccion/:slug" element={<EnConstruccion titulo="Sección" />} />
        <Route path="/articulo/:id" element={<EnConstruccion titulo="Artículo" />} />
        <Route path="/partido/:id" element={<EnConstruccion titulo="Partido" />} />
        <Route path="/buscar" element={<EnConstruccion titulo="Búsqueda" />} />
        <Route path="*" element={<EnConstruccion titulo="Página no encontrada" />} />
      </Route>
    </Routes>
  )
}
