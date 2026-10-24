import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import FormField from '../components/FormField'
import StepIndicator from '../components/StepIndicator'
import { calcularTotales } from '../utils/cart'
import { formatearMoneda } from '../utils/format'

export default function PaymentPage() {
  const { items } = useCart()
  const navigate = useNavigate()
  const [intento, setIntento] = useState(false)
  const { total } = calcularTotales(items)

  function manejarPago(e) {
    e.preventDefault()
    setIntento(true) // no se procesa nada: el módulo de pago aún no existe
  }

  return (
    <section>
      <StepIndicator actual={4} />
      <h1>Pago</h1>
      <p>Total a pagar: <strong>{formatearMoneda(total)}</strong></p>

      <form onSubmit={manejarPago} noValidate autoComplete="off" className="form">
        <fieldset>
          <legend>Pago con tarjeta</legend>
          <p className="notice">
            Vista previa del módulo de pago. No escribas datos reales: no se guardan ni se envían a ningún lado.
          </p>
          <FormField id="tarjeta-titular" label="Nombre del titular" autoComplete="off" />
          <FormField id="tarjeta-numero" label="Número de tarjeta" inputMode="numeric" placeholder="0000 0000 0000 0000" autoComplete="off" />
          <div className="row">
            <FormField id="tarjeta-vence" label="Vencimiento" placeholder="MM/AA" autoComplete="off" />
            <FormField id="tarjeta-cvv" label="CVV" inputMode="numeric" autoComplete="off" />
          </div>
        </fieldset>

        {intento && (
          <div className="alert alert--warning" role="alert">
            <strong>Pago no disponible.</strong> Esta funcionalidad todavía no se encuentra disponible.
            No se realizó ningún cargo.
          </div>
        )}

        <div className="actions">
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/resumen')}>
            Volver al resumen
          </button>
          <button type="submit" className="btn">Pagar {formatearMoneda(total)}</button>
        </div>
      </form>
    </section>
  )
}