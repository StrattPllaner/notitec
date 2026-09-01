import { Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout'
import Portada from './pages/Portada'
import Deportes from './pages/secciones/Deportes'
import PartidoDetalle from './pages/PartidoDetalle'
import EnConstruccion from './pages/EnConstruccion'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Portada />} />
        <Route path="/seccion/deportes" element={<Deportes />} />
        <Route path="/seccion/:slug" element={<EnConstruccion titulo="Sección" />} />
        <Route path="/articulo/:id" element={<EnConstruccion titulo="Artículo" />} />
        <Route path="/partido/:id" element={<PartidoDetalle />} />
        <Route path="/buscar" element={<EnConstruccion titulo="Búsqueda" />} />
        <Route path="*" element={<EnConstruccion titulo="Página no encontrada" />} />
      </Route>
    </Routes>
  )
}
