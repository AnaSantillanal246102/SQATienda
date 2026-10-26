// src/pages/CatalogPage.jsx
import { useState, useEffect, useMemo } from 'react'
import { obtenerProductos, obtenerCategorias, ordenarProductos } from '../services/productService'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'

// Ignora mayúsculas y acentos al buscar
const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function CatalogPage() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [textoBusqueda, setTextoBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [criterioOrden, setCriterioOrden] = useState('nombre')

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [prods, cats] = await Promise.all([obtenerProductos(), obtenerCategorias()])
        setProductos(prods)
        setCategorias(cats)
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar el catálogo. Verifica que el backend esté corriendo.')
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  const lista = useMemo(() => {
    const t = normalizar(textoBusqueda.trim())
    const filtrados = productos.filter(
      (p) =>
        (!categoriaSeleccionada || p.categoria === categoriaSeleccionada) &&
        (!t || normalizar(`${p.nombre} ${p.categoria} ${p.descripcion}`).includes(t))
    )
    return ordenarProductos(filtrados, criterioOrden)
  }, [productos, textoBusqueda, categoriaSeleccionada, criterioOrden])

  if (cargando) return <p>Cargando catálogo...</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <section>
      <h1>Catálogo</h1>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
        />
        <select
          aria-label="Filtrar por categoría"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          aria-label="Ordenar productos"
          value={criterioOrden}
          onChange={(e) => setCriterioOrden(e.target.value)}
        >
          <option value="nombre">Nombre (A-Z)</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
        </select>
      </div>

      <p aria-live="polite">{lista.length} productos</p>

      {lista.length === 0 ? (
        <EmptyState titulo="No se encontraron productos">
          <p>Prueba con otra búsqueda o categoría.</p>
        </EmptyState>
      ) : (
        <div className="grid">
          {lista.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </section>
  )
}