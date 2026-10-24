import { Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCheckout } from '../context/CheckoutContext'
import { validarCliente } from '../utils/validators'

export default function CheckoutGuard({ children }) {
  const { items } = useCart()
  const { cliente } = useCheckout()

  if (items.length === 0) return <Navigate to="/carrito" replace />
  if (!cliente || Object.keys(validarCliente(cliente)).length > 0) {
    return <Navigate to="/datos" replace />
  }
  return children
}