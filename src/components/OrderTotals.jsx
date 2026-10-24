import { calcularTotales } from '../utils/cart'
import { formatearMoneda } from '../utils/format'

export default function OrderTotals({ items }) {
  const { subtotal, iva, total } = calcularTotales(items)
  return (
    <dl className="totals">
      <div><dt>Subtotal</dt><dd>{formatearMoneda(subtotal)}</dd></div>
      <div><dt>IVA (16%)</dt><dd>{formatearMoneda(iva)}</dd></div>
      <div className="totals__total"><dt>Total</dt><dd>{formatearMoneda(total)}</dd></div>
    </dl>
  )
}