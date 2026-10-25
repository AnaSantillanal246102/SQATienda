import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import {
  buscarProductos,
  obtenerCategorias,
  obtenerDestacados,
  ordenarProductos,
} from '../services/productService'

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const texto = params.get('q') ?? ''
  const [categoria, setCategoria] = useState('')
  const [orden, setOrden] = useState('nombre')
  const categorias = obtenerCategorias()
  const hayFiltros = texto.trim() !== '' || categoria !== ''

  const productos = useMemo(
    () => ordenarProductos(buscarProductos({ texto, categoria }), orden),
    [texto, categoria, orden]
  )

  function limpiar() {
    setCategoria('')
    setParams({})
  }

  return (
    <div>
      <h1 className="sr-only">Catálogo de productos</h1>

      {!hayFiltros && (
        <>
          <section className="hero">
            <span className="hero__tag">Tecnología que te impulsa</span>
            <p className="hero__title">Equipos y componentes de última generación</p>
            <p className="hero__text">
              Laptops, desktops, monitores y accesorios para trabajo, estudio y gaming.
              Explora el catálogo y arma tu carrito en minutos.
            </p>
            <a href="#catalogo" className="btn btn--light">
              Ver catálogo <ArrowRight size={18} aria-hidden="true" />
            </a>
          </section>

          <section aria-labelledby="destacados">
            <h2 id="destacados">Destacados</h2>
            <div className="grid">
              {obtenerDestacados().map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        </>
      )}

      <section id="catalogo" aria-labelledby="todos">
        <div className="toolbar">
          <h2 id="todos">Todos los productos</h2>
          <div className="sort">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <label htmlFor="orden" className="sr-only">Ordenar por</label>
            <select id="orden" value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="nombre">Nombre (A-Z)</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <div className="chips" role="group" aria-label="Filtrar por categoría">
          {['', ...categorias].map((c) => (
            <button
              key={c || 'todos'}
              type="button"
              className={`chip${categoria === c ? ' chip--active' : ''}`}
              aria-pressed={categoria === c}
              onClick={() => setCategoria(c)}
            >
              {c || 'Todos'}
            </button>
          ))}
        </div>

        <p className="muted" aria-live="polite">
          {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
        </p>

        {productos.length === 0 ? (
          <div className="empty">
            <p>No encontramos productos con esa búsqueda.</p>
            <button type="button" className="btn" onClick={limpiar}>Limpiar filtros</button>
          </div>
        ) : (
          <div className="grid">
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}