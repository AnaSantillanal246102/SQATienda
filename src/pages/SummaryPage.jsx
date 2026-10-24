import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCheckout } from '../context/CheckoutContext'
import OrderTotals from '../components/OrderTotals'
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
    ['Ciudad', cliente.ciudad],
    ['Código postal', cliente.cp],
  ]

  return (
    <section>
      <StepIndicator actual={3} />
      <h1>Resumen de tu compra</h1>

      <h2>Productos</h2>
      <div className="table-wrap">
        <table className="table">
          <caption className="sr-only">Productos seleccionados</caption>
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
              <th scope="col">Importe</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.nombre}</td>
                <td>{i.cantidad}</td>
                <td>{formatearMoneda(i.precio)}</td>
                <td>{formatearMoneda(redondear(i.precio * i.cantidad))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderTotals items={items} />

      <h2>Datos de entrega</h2>
      <dl className="delivery">
        {entrega.map(([etiqueta, valor]) => (
          <div key={etiqueta}>
            <dt>{etiqueta}</dt>
            <dd>{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="actions">
        <div className="actions__group">
          <button className="btn btn--secondary" onClick={() => navigate('/carrito')}>Editar carrito</button>
          <button className="btn btn--secondary" onClick={() => navigate('/datos')}>Editar mis datos</button>
        </div>
        <button className="btn" onClick={() => navigate('/pago')}>Continuar al pago</button>
      </div>
    </section>
  )
}