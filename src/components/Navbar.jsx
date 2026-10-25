import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Cpu, Search, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { cantidadTotal } = useCart()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') ?? ''

  function buscar(e) {
    const v = e.target.value
    navigate(v ? `/?q=${encodeURIComponent(v)}` : '/', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="brand">
          <span className="brand__logo" aria-hidden="true"><Cpu size={22} /></span>
          ByteShop
        </Link>

        <form className="searchbar" role="search" onSubmit={(e) => e.preventDefault()}>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            aria-label="Buscar productos"
            placeholder="Buscar productos..."
            value={q}
            onChange={buscar}
          />
        </form>

        <nav aria-label="Principal">
          <NavLink to="/" end>Catálogo</NavLink>
          <NavLink to="/carrito" className="navbar__cart">
            <ShoppingCart size={20} aria-hidden="true" />
            Carrito
            {cantidadTotal > 0 && (
              <span className="navbar__count" aria-label={`${cantidadTotal} artículos en el carrito`}>
                {cantidadTotal}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}