
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCheckout } from '../context/CheckoutContext'
import EmptyState from '../components/EmptyState'

/**
 * Página que muestra la finalización del proceso de compra de demostración.
 *
 * Al mostrarse, vacía el carrito de compras y elimina los datos del cliente
 * guardados en el contexto. Informa al usuario que no se realizó ningún cobro
 * y proporciona un enlace para regresar al catálogo de productos.
 *
 * @author Jonathan Trejo
 * @version 1.0
 * @returns {JSX.Element} Mensaje de finalización con un enlace al catálogo.
 * @see useCart
 * @see useCheckout
 * @see EmptyState
 */
export default function FinishedPage() {
  const { vaciar } = useCart()
  const { guardarCliente } = useCheckout()

  /**
   * Limpia el carrito y los datos del cliente cuando se monta la página.
   *
   * @returns {void} No devuelve ningún valor directamente.
   * @see vaciar
   * @see guardarCliente
   */
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
