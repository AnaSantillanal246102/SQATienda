
import { Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCheckout } from '../context/CheckoutContext'
import { validarCliente } from '../utils/validators'

/**
 * Componente que protege las rutas del proceso de compra.
 *
 * Comprueba que el carrito tenga productos y que los datos
 * del cliente sean válidos antes de permitir el acceso
 * a las páginas protegidas del proceso de compra.
 *
 * Si no se cumplen las condiciones, redirige al usuario
 * a la página correspondiente.
 *
 * @author Ana Santillan
 * @version 1.0
 * @since 1.0
 * @param {Object} props Propiedades recibidas por el componente.
 * @param {import('react').ReactNode} props.children Contenido que se mostrará
 * si se cumplen las condiciones de acceso.
 * @return {JSX.Element} Contenido protegido o redirección a otra página.
 * @see /context/CartContext
 * @see /context/CheckoutContext
 * @see /utils/validators
 */
export default function CheckoutGuard({ children }) {

  // Obtiene los productos almacenados en el carrito.
  const { items } = useCart()

  // Obtiene los datos del cliente del contexto de compra.
  const { cliente } = useCheckout()

  // Si el carrito está vacío, redirige a la página del carrito.
  if (items.length === 0) {
    return <Navigate to="/carrito" replace />
  }

  // Comprueba que existan los datos del cliente
  // y que no haya errores de validación.
  if (
    !cliente ||
    Object.keys(validarCliente(cliente)).length > 0
  ) {
    // Si los datos no existen o son inválidos,
    // redirige al formulario para introducirlos.
    return <Navigate to="/datos" replace />
  }

  // Si se cumplen las condiciones, muestra la página solicitada.
  return children
}
