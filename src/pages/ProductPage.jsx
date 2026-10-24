import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProductoPorId } from '../services/productService'
import { useCart } from '../context/CartContext'
import { validarCantidad } from '../utils/cart'
import { formatearMoneda } from '../utils/format'

export default function ProductPage() {
  const { id } = useParams()
  const producto = obtenerProductoPorId(id)
  const { items, agregar } = useCart()
  const [cantidad, setCantidad] = useState('1')
  const [error, setError] = useState('')
  const [agregado, setAgregado] = useState(false)

  if (!producto) {
    return (
      <div className="empty">
        <h1>Producto no encontrado</h1>
        <p>Es posible que el enlace sea incorrecto.</p>
        <Link to="/" className="btn">Volver al catálogo</Link>
      </div>
    )
  }

  const enCarrito = items.find((i) => i.id === producto.id)?.cantidad ?? 0
  const disponibles = producto.stock - enCarrito
  const agotado = producto.stock === 0

  function manejarAgregar() {
    setAgregado(false)
    if (disponibles <= 0) {
      setError('Ya tienes en tu carrito todas las unidades disponibles.')
      return
    }
    const resultado = validarCantidad(Number(cantidad), disponibles)
    if (!resultado.valida) {
      setError(resultado.error)
      return
    }
    setError('')
    agregar(producto, Number(cantidad))
    setAgregado(true)
  }

  return (
    <section className="detail">
      <Link to="/">← Volver al catálogo</Link>
      <div className="detail__layout">
        <img src={producto.imagen} alt={producto.nombre} className="detail__img" />
        <div>
          <span className="card__cat">{producto.categoria}</span>
          <h1>{producto.nombre}</h1>
          <p className="card__price">{formatearMoneda(producto.precio)}</p>
          <p>{producto.descripcion}</p>

          {agotado ? (
            <span className="badge badge--out">Agotado</span>
          ) : (
            <p className="muted">{producto.stock} disponible(s)</p>
          )}

          <div className="field">
            <label htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              type="number"
              min="1"
              step="1"
              value={cantidad}
              disabled={agotado}
              onChange={(e) => { setCantidad(e.target.value); setError(''); setAgregado(false) }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'cantidad-error' : undefined}
            />
            {error && <p id="cantidad-error" className="error" role="alert">{error}</p>}
          </div>

          <button className="btn" onClick={manejarAgregar} disabled={agotado}>
            {agotado ? 'No disponible' : 'Agregar al carrito'}
          </button>

          {agregado && (
            <p className="success" role="status">
              Agregado al carrito. <Link to="/carrito">Ir al carrito</Link>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}