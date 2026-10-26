
import { calcularTotales } from '../utils/cart'
import { formatearMoneda } from '../utils/format'

/**
 * Componente que muestra el subtotal, el IVA del 16% y el total
 * de una orden de compra, con los importes formateados como moneda.
 *
 * @author Jared Martinez
 * @version 1.0
 * @param {Array} items - Lista de productos de la orden de compra.
 * @returns {JSX.Element} Elemento JSX con el desglose de los totales.
 * @see calcularTotales
 * @see formatearMoneda
 */
export default function OrderTotals({ items }) {
  const { subtotal, iva, total } = calcularTotales(items)

  return (
    <dl className="totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{formatearMoneda(subtotal)}</dd>
      </div>
      <div>
        <dt>IVA (16%)</dt>
        <dd>{formatearMoneda(iva)}</dd>
      </div>
      <div className="totals__total">
        <dt>Total</dt>
        <dd>{formatearMoneda(total)}</dd>
      </div>
    </dl>
  )
}
