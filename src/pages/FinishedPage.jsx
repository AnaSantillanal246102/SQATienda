import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCheckout } from '../context/CheckoutContext'
import EmptyState from '../components/EmptyState'

export default function FinishedPage() {
  const { vaciar } = useCart()
  const { guardarCliente } = useCheckout()

  useEffect(() => {
    vaciar()
    guardarCliente(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <EmptyState titulo="Demostración finalizada" as="h1">
      <p>No se realizó ningún cobro. Tu carrito y tus datos se borraron.</p>
      <Link to="/" className="btn">Volver al catálogo</Link>
    </EmptyState>
  )
}