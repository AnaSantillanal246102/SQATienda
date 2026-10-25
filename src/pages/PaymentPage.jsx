import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ban, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import FormField from '../components/FormField'
import StepIndicator from '../components/StepIndicator'
import { calcularTotales, validarCarrito } from '../utils/cart'
import { formatearMoneda } from '../utils/format'
import { obtenerProductos } from '../services/productService'

export default function PaymentPage() {
  const { items } = useCart()
  const navigate = useNavigate()
  const [intento, setIntento] = useState(false)
  const { subtotal, iva, total } = calcularTotales(items)
  const [problemas, setProblemas] = useState([])

  function manejarPago(e) {
    e.preventDefault()
    const encontrados = validarCarrito(items, obtenerProductos())
    setProblemas(encontrados)
    setIntento(encontrados.length === 0) // el pago nunca se procesa
  }

  return (
    <section className="narrow">
      <StepIndicator actual={4} />
      <h1>Pago</h1>

      <div className="amount">
        <p className="muted">Importe a pagar</p>
        <p className="amount__value">{formatearMoneda(total)}</p>
        <p className="muted small">Subtotal {formatearMoneda(subtotal)} + IVA {formatearMoneda(iva)}</p>
      </div>
    
      <form onSubmit={manejarPago} noValidate autoComplete="off" className="form">


        {intento && (
          <div className="alert alert--warning" role="alert">
            <span className="alert__icon"><Ban size={24} aria-hidden="true" /></span>
            <div>
              <strong>El servicio de pago todavía no se encuentra disponible.</strong>
              <p>No se ha realizado ningún cobro.</p>
              <button type="button" className="link-btn" onClick={() => navigate('/finalizado')}>
    Finalizar demostración
  </button>
            </div>
          </div>
        )}

        {problemas.length > 0 && (
          <div className="alert alert--danger" role="alert">
            <div>
              <strong>Revisa tu carrito antes de pagar:</strong>
              <ul>{problemas.map((m) => <li key={m}>{m}</li>)}</ul>
              <Link to="/carrito">Ir al carrito</Link>
            </div>
          </div>
        )}

        <p className="secure"><ShieldCheck size={16} aria-hidden="true" /> El modulo de pago no se encuentra activo.</p>

        <div className="actions">
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/carrito')}>Volver al carrito</button>
          <div className="actions__group">
            <button type="button" className="btn btn--secondary" onClick={() => navigate('/resumen')}>Volver al resumen</button>
            <button type="submit" className="btn">Pagar {formatearMoneda(total)}</button>
          </div>
        </div>
      </form>
    </section>
  )
}