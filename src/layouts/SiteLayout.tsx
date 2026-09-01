import { useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/ui/PageTransition'

export default function SiteLayout() {
  const location = useLocation()
  const outlet = useOutlet()

  // Al cambiar de ruta, vuelve al inicio de la página.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>{outlet}</PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
