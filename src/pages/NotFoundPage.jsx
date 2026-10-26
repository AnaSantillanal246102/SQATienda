
/**
 * @file NotFoundPage.jsx
 * @description Página que se muestra cuando se accede a una ruta inexistente.
 *
 * @author Ana Santillan
 * @version 1.0
 */

import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

/**
 * Muestra un mensaje de error cuando la página solicitada no existe.
 *
 * Informa al usuario que la dirección consultada no es válida
 * y proporciona un enlace para regresar al catálogo de productos.

 * @returns {JSX.Element} Mensaje de página no encontrada con un enlace al catálogo.
 * @see EmptyState
 * @see Link
 */
export default function NotFoundPage() {
  return (
    <EmptyState titulo="Página no encontrada" as="h1">
      <p>La dirección que buscas no existe.</p>
      <Link to="/" className="btn">Ir al catálogo</Link>
    </EmptyState>
  )
}
