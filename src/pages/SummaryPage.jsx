
/**
 * @file SummaryPage.jsx
 * @description Página de revisión de compra que presenta los productos
 * del carrito, los datos de entrega y los totales del pedido.
 *
 * @author Ana Santillan
 * @version 1.0
 */

import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useCheckout } from '../context/CheckoutContext'
import OrderTotals from '../components/OrderTotals'
import ProductImage from '../components/ProductImage'
import StepIndicator from '../components/StepIndicator'
import { redondear } from '../utils/cart'
import { formatearMoneda } from '../utils/format'

/**
 * Muestra el resumen de la compra antes de proceder al pago.
 *
 * Presenta los productos seleccionados, sus cantidades y precios,
 * los datos de entrega del cliente y los totales del pedido.
 *
 * Permite regresar al formulario para modificar los datos de entrega,
 * volver al carrito o continuar a la página de pago.
 * @returns {JSX.Element} Vista con el resumen de productos,
 * los datos del cliente y las opciones para continuar la compra.
 * @see useCart
 * @see useCheckout
 * @see OrderTotals
 * @see ProductImage
 * @see StepIndicator
 * @see redondear
 * @see formatearMoneda
 */
export default function SummaryPage() {
  /**
   * Productos y cantidades almacenados en el carrito.
   *
   * @type {Array<Object>}
   */
  const { items } = useCart()

  /**
   * Datos de entrega del cliente almacenados durante el proceso
   * de compra.
   *
   * @type {Object}
   */
  const { cliente } = useCheckout()

  /**
   * Función de navegación entre las páginas de la aplicación.
   *
   * @type {Function}
   */
  const navigate = useNavigate()

  /**
   * Lista de datos de entrega que se mostrarán en el resumen.
   *
   * Cada elemento contiene una etiqueta descriptiva y el valor
   * correspondiente a los datos registrados por el cliente.
   *
   * @type {Array<Array<string>>}
   */
  const entrega = [
    ['Nombre', cliente.nombre],
    ['Correo', cliente.email],
    ['Teléfono', cliente.telefono],
    ['Dirección', cliente.direccion],
    [
      'Ubicación',
      `${cliente.ciudad}, ${cliente.estado}, ${cliente.cp}`,
    ],
  ]

  return (
    <section>
      {/* Indica que el usuario se encuentra en el tercer paso */}
      <StepIndicator actual={3} />

      <h1>Revisión de compra</h1>

      <div className="layout">
        <div className="stack">
          {/* Lista de productos seleccionados */}
          <section className="panel" aria-labelledby="productos-h">
            <h2 id="productos-h">Productos</h2>

            <ul className="review-list">
              {items.map((i) => (
                <li key={i.id}>
                  <ProductImage
                    id={i.id}
                    nombre={i.nombre}
                    imagen={i.imagen}
                    size="thumb"
                    decorativo
                  />

                  <div>
                    <p className="review__name">{i.nombre}</p>

                    <p className="muted">
                      {i.cantidad} × {formatearMoneda(i.precio)}
                    </p>
                  </div>

                  <strong>
                    {formatearMoneda(
                      redondear(i.precio * i.cantidad)
                    )}
                  </strong>
                </li>
              ))}
            </ul>
          </section>

          {/* Información del destinatario y dirección de entrega */}
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

            <Link to="/datos" className="link">
              Editar datos de entrega
            </Link>
          </section>
        </div>

        {/* Resumen económico y navegación al siguiente paso */}
        <aside className="summary-card" aria-label="Totales del pedido">
          <p className="verified">
            <BadgeCheck size={20} aria-hidden="true" />
            Datos de la compra validados
          </p>

          <h2>Totales</h2>

          <OrderTotals items={items} />

          <button
            className="btn btn--block"
            onClick={() => navigate('/pago')}
          >
            Ir al pago
            <ArrowRight size={18} aria-hidden="true" />
          </button>

          <button
            className="btn btn--secondary btn--block"
            onClick={() => navigate('/carrito')}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Modificar carrito
          </button>
        </aside>
      </div>
    </section>
  )
}
