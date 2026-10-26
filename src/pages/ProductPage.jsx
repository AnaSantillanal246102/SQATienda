
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProductoPorId } from '../services/productService'
import { useCart } from '../context/CartContext'
import { validarCantidad } from '../utils/cart'
import { formatearMoneda } from '../utils/format'
import EmptyState from '../components/EmptyState'

export default function ProductPage() {
  const { id } = useParams()
  const { items, agregar } = useCart()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [cantidad, setCantidad] = useState('1')
  const [error, setError] = useState('')
  const [agregado, setAgregado] = useState(false)

  // Obtener el producto desde el backend
  useEffect(() => {
    let activo = true

    async function cargarProducto() {
      setCargando(true)
      setErrorCarga('')
      setProducto(null)

      try {
        const resultado = await obtenerProductoPorId(id)

        if (activo) {
          setProducto(resultado)
        }
      } catch (err) {
        console.error('Error al cargar el producto:', err)

        if (activo) {
          setErrorCarga('No se pudo cargar el producto. Inténtalo de nuevo.')
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarProducto()

    return () => {
      activo = false
    }
  }, [id])

  if (cargando) {
    return <p role="status">Cargando producto...</p>
  }

  if (errorCarga) {
    return (
      <section className="detail">
        <p role="alert">{errorCarga}</p>
        <Link to="/" className="btn">
          Volver al catálogo
        </Link>
      </section>
    )
  }

  if (!producto) {
    return (
      <EmptyState titulo="Producto no encontrado" as="h1">
        <p>Es posible que el enlace sea incorrecto.</p>
        <Link to="/" className="btn">
          Volver al catálogo
        </Link>
      </EmptyState>
    )
  }

  const enCarrito =
    items.find((i) => String(i.id) === String(producto.id))?.cantidad ?? 0

  const stock = Number(producto.stock)
  const precio = Number(producto.precio)
  const disponibles = stock - enCarrito
  const agotado = !Number.isFinite(stock) || stock <= 0

  function manejarAgregar() {
    setAgregado(false)

    if (agotado) {
      setError('Este producto no está disponible.')
      return
    }

    if (disponibles <= 0) {
      setError('Ya tienes en tu carrito todas las unidades disponibles.')
      return
    }

    const resultado = validarCantidad(Number(cantidad), disponibles)

    if (!resultado.valida) {
      setError(resultado.error)
      return
    }

    if (!Number.isFinite(precio)) {
      setError('El precio del producto no es válido.')
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
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="detail__img"
        />

        <div>
          <span className="card__cat">{producto.categoria}</span>
          <h1>{producto.nombre}</h1>

          <p className="card__price">
            {Number.isFinite(precio)
              ? formatearMoneda(precio)
              : 'Precio no disponible'}
          </p>

          <p>{producto.descripcion}</p>

          {agotado ? (
            <span className="badge badge--out">Agotado</span>
          ) : (
            <p className="muted">{stock} disponible(s)</p>
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
              onChange={(e) => {
                setCantidad(e.target.value)
                setError('')
                setAgregado(false)
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'cantidad-error' : undefined}
            />

            {error && (
              <p id="cantidad-error" className="error" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn"
            onClick={manejarAgregar}
            disabled={agotado || !Number.isFinite(precio)}
          >
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
