import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { cantidadTotal } = useCart()
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span aria-hidden="true">🛍️</span> Mi Tienda
        </Link>
        <nav aria-label="Principal">
          <NavLink to="/" end>Catálogo</NavLink>
          <NavLink to="/carrito">
            <span aria-hidden="true">🛒</span> Carrito
            <span
              className="navbar__count"
              aria-live="polite"
              aria-label={`${cantidadTotal} artículos en el carrito`}
            >
              {cantidadTotal}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}