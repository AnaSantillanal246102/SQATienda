import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import OrderTotals from '../components/OrderTotals'
import StepIndicator from '../components/StepIndicator'
import { render, screen, fireEvent, within } from '@testing-library/react'

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
      <h1>Tu carrito</h1>
      <ul className="cart-list">
        {items.map((item) => (
          <CartItem key={item.id} item={item} onCambiar={cambiar} onQuitar={quitar} />
        ))}
      </ul>
      <OrderTotals items={items} />

      <div className="actions">
        {confirmando ? (
          <div className="actions__group" role="group" aria-label="Confirmar vaciado del carrito">
            <span>¿Vaciar todo el carrito?</span>
            <button className="btn btn--danger" onClick={vaciar}>Sí, vaciar</button>
            <button className="btn btn--secondary" onClick={() => setConfirmando(false)}>Cancelar</button>
          </div>
        ) : (
          <button className="btn btn--secondary" onClick={() => setConfirmando(true)}>
            Vaciar carrito
          </button>
        )}
        <button className="btn" onClick={() => navigate('/datos')}>Continuar con mis datos</button>
      </div>
    </section>
  )
}