import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal, Eye, ListChecks, Sparkles } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import Hero from '../components/Hero'
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
      {hayFiltros && <h1 className="sr-only">Catálogo de productos</h1>}

      {!hayFiltros && (
        <>
        <Hero />

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
          <EmptyState titulo="Sin resultados">
            <p>No encontramos productos con esa búsqueda.</p>
            <button type="button" className="btn" onClick={limpiar}>Limpiar filtros</button>
          </EmptyState>
        ) : (
          <div className="grid">
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </section>
      <section className="benefits" aria-labelledby="beneficios">
        <h2 id="beneficios" className="sr-only">¿Por qué comprar aquí?</h2>
        <div>
          <Sparkles size={26} aria-hidden="true" />
          <h3>Simple por diseño</h3>
          <p>Encuentra y compara equipos sin complicaciones.</p>
        </div>
        <div>
          <Eye size={26} aria-hidden="true" />
          <h3>Información clara</h3>
          <p>Precios, IVA y existencias visibles durante tu compra.</p>
        </div>
        <div>
          <ListChecks size={26} aria-hidden="true" />
          <h3>Tú tienes el control</h3>
          <p>Revisa tus datos y el resumen antes de llegar al pago de demostración.</p>
        </div>
      </section>
    </div>
  )
}