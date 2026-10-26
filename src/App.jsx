
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import RouteEffects from './components/RouteEffects'
import CheckoutGuard from './components/CheckoutGuard'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import SummaryPage from './pages/SummaryPage'
import PaymentPage from './pages/PaymentPage'
import NotFoundPage from './pages/NotFoundPage'
import FinishedPage from "./pages/FinishedPage"

/**
 * Componente principal de la aplicación Mora Store.
 *
 * Organiza las rutas de navegación, muestra la barra de navegación,
 * el contenido de cada página y el pie de página.
 *
 * @author Ana Santillan
 * @author Jared Beltran
 * @author Jared Martinez
 * @author Jonathan Trejo
 * @version 1.0
 * @since 10/25/2028
 * @see Navbar
 * @see RouteEffects
 * @see CheckoutGuard
 */
export default function App() {
  return (
    <>
      {/* Enlace para saltar directamente al contenido principal */}
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      {/* Ejecuta efectos relacionados con los cambios de ruta */}
      <RouteEffects />

      {/* Barra de navegación principal */}
      <Navbar />

      {/* Contenedor del contenido principal */}
      <main
        id="contenido"
        tabIndex={-1}
        className="container"
      >
        <Routes>
          {/* Página principal: catálogo de productos */}
          <Route path="/" element={<CatalogPage />} />

          {/* Página con los detalles de un producto específico */}
          <Route path="/producto/:id" element={<ProductPage />} />

          {/* Página del carrito de compras */}
          <Route path="/carrito" element={<CartPage />} />

          {/* Página para introducir los datos de compra */}
          <Route path="/datos" element={<CheckoutPage />} />

          {/* Resumen de compra protegido por CheckoutGuard */}
          <Route
            path="/resumen"
            element={
              <CheckoutGuard>
                <SummaryPage />
              </CheckoutGuard>
            }
          />

          {/* Página de pago protegida por CheckoutGuard */}
          <Route
            path="/pago"
            element={
              <CheckoutGuard>
                <PaymentPage />
              </CheckoutGuard>
            }
          />

          {/* Página que confirma la finalización de la compra */}
          <Route path="/finalizado" element={<FinishedPage />} />

          {/* Página mostrada cuando la ruta no existe */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Pie de página de la tienda */}
      <footer className="footer">
        <a className="brandj footer-brand" href="#inicio">
          mora<span className="brandj-dot">.</span>
        </a>
        <span>© 2026 Mora Store</span>
      </footer>
    </>
  )
}
