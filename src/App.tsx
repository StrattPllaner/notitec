import { Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout'
import Portada from './pages/Portada'
import Deportes from './pages/secciones/Deportes'
import SeccionGenerica from './pages/secciones/SeccionGenerica'
import PartidoDetalle from './pages/PartidoDetalle'
import Articulo from './pages/Articulo'
import Busqueda from './pages/Busqueda'
import NoEncontrado from './pages/NoEncontrado'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Portada />} />
        <Route path="/seccion/deportes" element={<Deportes />} />
        <Route path="/seccion/:slug" element={<SeccionGenerica />} />
        <Route path="/articulo/:id" element={<Articulo />} />
        <Route path="/partido/:id" element={<PartidoDetalle />} />
        <Route path="/buscar" element={<Busqueda />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}
