
/**
 * @file ProductPage.jsx
 * @description Página de detalle de un producto. Permite consultar su
 * información, verificar su disponibilidad y agregar unidades al carrito.
 *
 * @author Ana Santillan
 * @version 1.0
 */

import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProductoPorId } from '../services/productService'
import { useCart } from '../context/CartContext'
import { validarCantidad } from '../utils/cart'
import { formatearMoneda } from '../utils/format'
import EmptyState from '../components/EmptyState'

/**
 * Muestra el detalle de un producto seleccionado del catálogo.
 *
 * Obtiene el producto desde el backend utilizando su identificador.
 * Presenta su imagen, nombre, categoría, descripción, precio y stock.
 * Permite seleccionar una cantidad y agregarla al carrito después
 * de validar las existencias disponibles y el precio.
 *
 * También gestiona los estados de carga, los errores y la confirmación
 * de agregado al carrito.
 * @returns {JSX.Element} Vista del producto, estado de carga,
 * mensaje de error o aviso de producto no encontrado.
 * @see obtenerProductoPorId
 * @see useCart
 * @see validarCantidad
 * @see formatearMoneda
 * @see EmptyState
 */
export default function ProductPage() {
  const { id } = useParams()
  const { items, agregar } = useCart()

  /**
   * Producto obtenido desde el backend.
   *
   * @type {[Object|null, Function]}
   */
  const [producto, setProducto] = useState(null)

  /**
   * Indica si la consulta del producto está en curso.
   *
   * @type {[boolean, Function]}
   */
  const [cargando, setCargando] = useState(true)

  /**
   * Mensaje de error producido durante la carga del producto.
   *
   * @type {[string, Function]}
   */
  const [errorCarga, setErrorCarga] = useState('')

  /**
   * Cantidad de unidades que el usuario desea agregar al carrito.
   *
   * @type {[string, Function]}
   */
  const [cantidad, setCantidad] = useState('1')

  /**
   * Mensaje de error relacionado con la cantidad o la disponibilidad.
   *
   * @type {[string, Function]}
   */
  const [error, setError] = useState('')

  /**
   * Indica si el producto se agregó correctamente al carrito.
   *
   * @type {[boolean, Function]}
   */
  const [agregado, setAgregado] = useState(false)

  /**
   * Obtiene el producto solicitado desde el backend.
   *
   * Restablece los estados de carga y error antes de realizar
   * la consulta. Si la petición termina correctamente, guarda
   * el producto; en caso de error, muestra un mensaje.
   *
   * La variable activo evita actualizar el estado después
   * de que el efecto se haya limpiado.
   *
   * @returns {void} No devuelve ningún valor directamente.
   * @see obtenerProductoPorId
   */
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
          setErrorCarga(
            'No se pudo cargar el producto. Inténtalo de nuevo.'
          )
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

  // Muestra el estado de carga mientras se obtiene el producto.
  if (cargando) {
    return <p role="status">Cargando producto...</p>
  }

  // Muestra un mensaje si ocurre un error al consultar el backend.
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

  // Informa cuando el producto solicitado no existe.
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

  /**
   * Cantidad del producto que ya se encuentra en el carrito.
   *
   * @type {number}
   */
  const enCarrito =
    items.find((i) => String(i.id) === String(producto.id))?.cantidad ?? 0

  /**
   * Existencias actuales del producto convertidas a número.
   *
   * @type {number}
   */
  const stock = Number(producto.stock)

  /**
   * Precio unitario del producto convertido a número.
   *
   * @type {number}
   */
  const precio = Number(producto.precio)

  /**
   * Cantidad de unidades que todavía pueden agregarse al carrito.
   *
   * @type {number}
   */
  const disponibles = stock - enCarrito

  /**
   * Indica si el producto está agotado o tiene un stock inválido.
   *
   * @type {boolean}
   */
  const agotado = !Number.isFinite(stock) || stock <= 0

  /**
   * Valida la disponibilidad, la cantidad solicitada y el precio
   * antes de agregar el producto al carrito.
   *
   * Si alguna validación falla, muestra el mensaje correspondiente.
   * Si todas las validaciones son satisfactorias, agrega el producto
   * y activa el indicador de confirmación.
   *
   * @returns {void} No devuelve ningún valor.
   * @see validarCantidad
   * @see useCart
   */
  function manejarAgregar() {
    setAgregado(false)

    if (agotado) {
      setError('Este producto no está disponible.')
      return
    }

    if (disponibles <= 0) {
      setError(
        'Ya tienes en tu carrito todas las unidades disponibles.'
      )
      return
    }

    const resultado = validarCantidad(
      Number(cantidad),
      disponibles
    )

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
