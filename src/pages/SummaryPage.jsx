import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useCheckout } from '../context/CheckoutContext'
import OrderTotals from '../components/OrderTotals'
import ProductImage from '../components/ProductImage'
import StepIndicator from '../components/StepIndicator'
import { redondear } from '../utils/cart'
import { formatearMoneda } from '../utils/format'

export default function SummaryPage() {
  const { items } = useCart()
  const { cliente } = useCheckout()
  const navigate = useNavigate()

  const entrega = [
    ['Nombre', cliente.nombre],
    ['Correo', cliente.email],
    ['Teléfono', cliente.telefono],
    ['Dirección', cliente.direccion],
    ['Ubicación', `${cliente.ciudad}, ${cliente.estado}, ${cliente.cp}`],
  ]

  return (
    <section>
      <StepIndicator actual={3} />
      <h1>Revisión de compra</h1>
      <div className="layout">
        <div className="stack">
          <section className="panel" aria-labelledby="productos-h">
            <h2 id="productos-h">Productos</h2>
            <ul className="review-list">
              {items.map((i) => (
                <li key={i.id}>
                  <ProductImage id={i.id} nombre={i.nombre} imagen={i.imagen} size="thumb" decorativo />
                  <div>
                    <p className="review__name">{i.nombre}</p>
                    <p className="muted">{i.cantidad} × {formatearMoneda(i.precio)}</p>
                  </div>
                  <strong>{formatearMoneda(redondear(i.precio * i.cantidad))}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel" aria-labelledby="entrega-h">
            <h2 id="entrega-h">Datos de entrega</h2>
            <dl className="delivery">
              {entrega.map(([etiqueta, valor]) => (
                <div key={etiqueta}>
                  <dt>{etiqueta}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>
            <Link to="/datos" className="link">Editar datos de entrega</Link>
          </section>
        </div>

        <aside className="summary-card" aria-label="Totales del pedido">
          <p className="verified"><BadgeCheck size={20} aria-hidden="true" /> Datos de la compra validados</p>
          <h2>Totales</h2>
          <OrderTotals items={items} />
          <button className="btn btn--block" onClick={() => navigate('/pago')}>
            Ir al pago <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button className="btn btn--secondary btn--block" onClick={() => navigate('/carrito')}>
            <ArrowLeft size={18} aria-hidden="true" /> Modificar carrito
          </button>
        </aside>
      </div>
    </section>
  )
}