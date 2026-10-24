import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import NotFoundPage from './pages/NotFoundPage'
import CheckoutPage from "./pages/CheckoutPage"
import SummaryPage from "./pages/SummaryPage"
import PaymentPage from "./pages/PaymentPage"
import CheckoutGuard from "./components/CheckoutGuard"

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/datos" element={<CheckoutPage />} />
          <Route path="/resumen" element={<CheckoutGuard><SummaryPage /></CheckoutGuard>} />
          <Route path="/pago" element={<CheckoutGuard><PaymentPage /></CheckoutGuard>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}