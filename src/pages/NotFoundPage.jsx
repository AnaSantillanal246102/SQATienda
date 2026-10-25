import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function NotFoundPage() {
  return (
    <EmptyState titulo="Página no encontrada" as="h1">
      <p>La dirección que buscas no existe.</p>
      <Link to="/" className="btn">Ir al catálogo</Link>
    </EmptyState>
  )
}