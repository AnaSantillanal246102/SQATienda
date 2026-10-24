import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { buscarProductos, obtenerCategorias } from '../services/productService'

export default function CatalogPage() {
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('')
  const categorias = obtenerCategorias()
  const productos = useMemo(
    () => buscarProductos({ texto, categoria }),
    [texto, categoria]
  )

  return (
    <section>
      <h1>Catálogo</h1>

      <div className="filters">
        <div className="field">
          <label htmlFor="busqueda">Buscar producto</label>
          <input
            id="busqueda"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej. cable, mochila..."
          />
        </div>
        <div className="field">
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
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