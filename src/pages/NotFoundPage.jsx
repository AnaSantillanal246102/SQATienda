import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="empty">
      <h1>Página no encontrada</h1>
      <Link to="/" className="btn">Ir al catálogo</Link>
    </div>
  )
}