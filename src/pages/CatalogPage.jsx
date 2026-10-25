import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import {
  buscarProductos,
  obtenerCategorias,
  obtenerProductos,
} from '../services/productService'
import { CATEGORIAS } from '../utils/visuals'

export default function CatalogPage() {
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('')
  const categorias = obtenerCategorias()
  const total = obtenerProductos().length
  const productos = useMemo(
    () => buscarProductos({ texto, categoria }),
    [texto, categoria]
  )

  return (
    <section>
      <div className="hero">
        <h1>Encuentra lo que necesitas</h1>
        <p>
          Explora {total} productos en {categorias.length} categorías, arma tu
          carrito y revisa tu compra antes de pagar.
        </p>
      </div>

      <div className="field search">
        <label htmlFor="busqueda">Buscar producto</label>
        <input
          id="busqueda"
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej. cable, mochila..."
        />
      </div>

      <div className="chips" role="group" aria-label="Filtrar por categoría">
        <button
          className={`chip${categoria === '' ? ' chip--active' : ''}`}
          aria-pressed={categoria === ''}
          onClick={() => setCategoria('')}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c}
            className={`chip${categoria === c ? ' chip--active' : ''}`}
            aria-pressed={categoria === c}
            onClick={() => setCategoria(c)}
          >
            <span aria-hidden="true">{CATEGORIAS[c]?.icono}</span> {c}
          </button>
        ))}
      </div>

      <p className="muted" aria-live="polite">{productos.length} producto(s)</p>

      {productos.length === 0 ? (
        <div className="empty">
          <p>No encontramos productos con esa búsqueda.</p>
          <button className="btn" onClick={() => { setTexto(''); setCategoria('') }}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid">
          {productos.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </section>
  )
}