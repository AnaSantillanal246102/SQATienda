
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  SlidersHorizontal,
  Eye,
  ListChecks,
  Sparkles,
} from 'lucide-react'

import {
  obtenerProductos,
  obtenerCategorias,
  obtenerDestacados,
  ordenarProductos,
} from '../services/productService'

import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import Hero from '../components/Hero'

// Ignorar mayúsculas y acentos en las búsquedas
const normalizar = (texto = '') =>
  String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()

  const texto = params.get('q') ?? ''

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [destacados, setDestacados] = useState([])

  const [categoria, setCategoria] = useState('')
  const [orden, setOrden] = useState('nombre')

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Cargar datos del backend
  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      try {
        setCargando(true)
        setError(null)

        const [prods, cats, dest] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias(),
          obtenerDestacados(),
        ])

        if (!activo) return

        setProductos(prods)
        setCategorias(cats)
        setDestacados(dest)
      } catch (err) {
        console.error('Error al cargar el catálogo:', err)

        if (activo) {
          setError(
            'No se pudo cargar el catálogo. Verifica que el backend esté corriendo.'
          )
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarDatos()

    return () => {
      activo = false
    }
  }, [])

  // Buscar, filtrar y ordenar productos
  const lista = useMemo(() => {
    const t = normalizar(texto.trim())

    const filtrados = productos.filter((p) => {
      const coincideCategoria =
        !categoria || p.categoria === categoria

      const contenido = normalizar(
        `${p.nombre ?? ''} ${p.categoria ?? ''} ${p.descripcion ?? ''}`
      )

      const coincideTexto = !t || contenido.includes(t)

      return coincideCategoria && coincideTexto
    })

    return ordenarProductos(filtrados, orden)
  }, [productos, texto, categoria, orden])

  const hayFiltros = texto.trim() !== '' || categoria !== ''

  function cambiarBusqueda(valor) {
    setParams((actuales) => {
      const nuevos = new URLSearchParams(actuales)

      if (valor.trim()) {
        nuevos.set('q', valor)
      } else {
        nuevos.delete('q')
      }

      return nuevos
    }, { replace: true })
  }

  function limpiar() {
    setCategoria('')
    setParams({})
  }

  // Estado de carga
  if (cargando) {
    return <p role="status">Cargando catálogo...</p>
  }

  // Estado de error
  if (error) {
    return <p role="alert">{error}</p>
  }

  return (
    <div>
      {/* Portada y destacados */}
      {!hayFiltros && (
        <>
          <Hero />

          {destacados.length > 0 && (
            <section aria-labelledby="destacados">
              <h2 id="destacados">Destacados</h2>

              <div className="grid">
                {destacados.map((p) => (
                  <ProductCard key={p.id} producto={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Catálogo completo */}
      <section id="catalogo" aria-labelledby="todos">
        <div className="toolbar">
          <h2 id="todos">Todos los productos</h2>

          <div className="sort">
            <SlidersHorizontal size={18} aria-hidden="true" />

            <label htmlFor="orden" className="sr-only">
              Ordenar por
            </label>

            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="nombre">Nombre (A-Z)</option>
              <option value="precio-asc">
                Precio: menor a mayor
              </option>
              <option value="precio-desc">
                Precio: mayor a menor
              </option>
            </select>
          </div>
        </div>

        {/* Buscador */}
        <div className="toolbar">
          <label htmlFor="buscar-productos" className="sr-only">
            Buscar productos
          </label>

          <input
            id="buscar-productos"
            type="search"
            placeholder="Buscar productos..."
            value={texto}
            onChange={(e) => cambiarBusqueda(e.target.value)}
          />
        </div>

        {/* Filtros por categoría */}
        <div
          className="chips"
          role="group"
          aria-label="Filtrar por categoría"
        >
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
          {lista.length}{' '}
          {lista.length === 1 ? 'producto' : 'productos'}
        </p>

        {/* Resultados */}
        {lista.length === 0 ? (
          <EmptyState titulo="Sin resultados">
            <p>No encontramos productos con esa búsqueda.</p>

            <button
              type="button"
              className="btn"
              onClick={limpiar}
            >
              Limpiar filtros
            </button>
          </EmptyState>
        ) : (
          <div className="grid">
            {lista.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </section>

      {/* Beneficios originales */}
      <section className="benefits" aria-labelledby="beneficios">
        <h2 id="beneficios" className="sr-only">
          ¿Por qué comprar aquí?
        </h2>

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
          <p>
            Revisa tus datos y el resumen antes de llegar al pago
            de demostración.
          </p>
        </div>
      </section>
    </div>
  )
}
