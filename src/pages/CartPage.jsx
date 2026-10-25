import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import OrderTotals from '../components/OrderTotals'
import StepIndicator from '../components/StepIndicator'

export default function CartPage() {
  const { items, cambiar, quitar, vaciar } = useCart()
  const navigate = useNavigate()
  const [confirmando, setConfirmando] = useState(false)

  if (items.length === 0) {
    return (
      <div className="empty">
        <h1>Tu carrito está vacío</h1>
        <p>Agrega productos desde el catálogo para comenzar.</p>
        <Link to="/" className="btn">Ir al catálogo</Link>
      </div>
    )
  }

  return (
    <section>
      <StepIndicator actual={1} />
      <h1>Carrito de compra</h1>
      <div className="layout">
        <div>
          <ul className="cart-list">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onCambiar={cambiar} onQuitar={quitar} />
            ))}
          </ul>
          <div className="cart-links">
            <Link to="/" className="link-back">
              <ArrowLeft size={18} aria-hidden="true" /> Seguir comprando
            </Link>
            {confirmando ? (
              <div className="actions__group" role="group" aria-label="Confirmar vaciado del carrito">
                <span>¿Vaciar todo el carrito?</span>
                <button className="btn btn--danger" onClick={vaciar}>Sí, vaciar</button>
                <button className="btn btn--secondary" onClick={() => setConfirmando(false)}>Cancelar</button>
              </div>
            ) : (
              <button type="button" className="link-btn" onClick={() => setConfirmando(true)}>
                Vaciar carrito
              </button>
            )}
          </div>
        </div>

        <aside className="summary-card" aria-label="Resumen del pedido">
          <h2>Resumen</h2>
          <OrderTotals items={items} />
          <p className="note">El IVA (16%) se calcula automáticamente sobre el subtotal.</p>
          <button className="btn btn--block" onClick={() => navigate('/datos')}>
            Continuar <ArrowRight size={18} aria-hidden="true" />
          </button>
        </aside>
      </div>
    </section>
  )
}