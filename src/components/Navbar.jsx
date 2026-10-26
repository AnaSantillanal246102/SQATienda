
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

/**
 * Componente de navegación principal de MoraShop.
 *
 * Muestra el logotipo de la tienda, un campo de búsqueda de productos
 * y enlaces para acceder al catálogo y al carrito de compras.
 * También muestra la cantidad total de artículos añadidos al carrito.
 *
 * La búsqueda actualiza los parámetros de la URL para conservar
 * el término introducido y facilitar la navegación por el catálogo.
 *
 * @author Ana Santillan
 * @version 2.0
 * @since 1.0
 * @return {JSX.Element} Barra de navegación principal de la tienda.
 * @see useCart
 * @see Link
 * @see NavLink
 */
export default function Navbar() {

  // Obtiene la cantidad total de artículos del carrito.
  const { cantidadTotal } = useCart()

  // Obtiene los parámetros de búsqueda presentes en la URL.
  const [params] = useSearchParams()

  // Permite navegar a otras rutas de la aplicación.
  const navigate = useNavigate()

  // Recupera el término de búsqueda o utiliza una cadena vacía.
  const q = params.get('q') ?? ''

  /**
   * Actualiza la búsqueda de productos a medida que el usuario escribe.
   *
   * Modifica el parámetro q de la URL y reemplaza la entrada actual
   * del historial para evitar crear una entrada por cada carácter.
   *
   * @param {Object} e Evento de cambio del campo de búsqueda.
   * @return {void} Actualiza la URL con el término introducido.
   */
  function buscar(e) {

    // Obtiene el texto introducido en el campo de búsqueda.
    const v = e.target.value

    // Actualiza la URL con el término codificado.
    // Si el campo está vacío, vuelve a la ruta principal.
    navigate(
      v ? `/?q=${encodeURIComponent(v)}` : '/',
      { replace: true }
    )
  }

  return (
    // Encabezado principal de navegación.
    <header className="navbar">
      <div className="navbar__inner">

        {/* Logotipo y enlace a la página principal */}
        <Link to="/" className="brand">

          {/* Imagen decorativa del logotipo */}
          <img
            src="/img/robot-head.png"
            alt=""
            className="brand__logo"
            width="44"
            height="44"
          />

          {/* Nombre de la tienda */}
          <span className="topbarj">
            <span
              className="brandj"
              aria-label="Mora inicio"
            >
              mora<span className="brandj-dot">.</span>
            </span>
          </span>
        </Link>

        {/* Formulario de búsqueda de productos */}
        <form
          className="searchbar"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >

          {/* Icono decorativo de búsqueda */}
          <Search size={18} aria-hidden="true" />

          {/* Campo de entrada vinculado al parámetro q */}
          <input
            type="search"
            aria-label="Buscar productos"
            placeholder="Buscar productos..."
            value={q}
            onChange={buscar}
          />
        </form>

        {/* Enlaces principales de navegación */}
        <nav aria-label="Principal">

          {/* Enlace al catálogo; end limita la coincidencia a la ruta exacta */}
          <NavLink to="/" end>
            Catálogo
          </NavLink>

          {/* Enlace al carrito con su contador de artículos */}
          <NavLink to="/carrito" className="navbar__cart">

            {/* Icono decorativo del carrito */}
            <ShoppingCart size={20} aria-hidden="true" />

            Carrito

            {/* Muestra el contador únicamente si hay artículos */}
            {cantidadTotal > 0 && (
              <span
                className="navbar__count"
                aria-label={`${cantidadTotal} artículos en el carrito`}
              >
                {cantidadTotal}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
