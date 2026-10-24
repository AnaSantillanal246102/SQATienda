import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import OrderTotals from '../components/OrderTotals'
import StepIndicator from '../components/StepIndicator'

export default function CartPage() {
  const { items, cambiar, quitar, vaciar } = useCart()
  const navigate = useNavigate()

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
        <button className="btn btn--secondary" onClick={vaciar}>Vaciar carrito</button>
        <button className="btn" onClick={() => navigate('/datos')}>Continuar con mis datos</button>
      </div>
    </section>
  )
}