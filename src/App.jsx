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
import FinishedPage from "./pages/FinishedPage";

export default function App() {
  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <RouteEffects />
      <Navbar />
      <main id="contenido" tabIndex={-1} className="container">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/datos" element={<CheckoutPage />} />
          <Route path="/resumen" element={<CheckoutGuard><SummaryPage /></CheckoutGuard>} />
          <Route path="/pago" element={<CheckoutGuard><PaymentPage /></CheckoutGuard>} />
          <Route path="/finalizado" element={<FinishedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="footer">
      <a class="brandj footer-brand" href="#inicio">
        mora<span class="brandj-dot">.</span>
      </a>
      <span>© 2026 Mora Store</span>
      </footer>
    </>
  )
}