
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import ProductImage from './ProductImage'
import { redondear, validarCantidad } from '../utils/cart'
import { formatearMoneda } from '../utils/format'

/**
 * Componente que representa un producto dentro del carrito de compras.
 *
 * Muestra la información del producto, permite modificar su cantidad,
 * eliminarlo del carrito y consultar su precio total.
 * También valida las cantidades introducidas y muestra errores
 * cuando la cantidad no es válida.
 *
 * @author Ana Santillan
 * @version 1.0
 * @since 1.0
 * @param {Object} props Propiedades recibidas por el componente.
 * @param {Object} props.item Información del producto del carrito.
 * @param {Function} props.onCambiar Función para actualizar la cantidad.
 * @param {Function} props.onQuitar Función para eliminar el producto.
 * @return {JSX.Element} Elemento visual del producto en el carrito.
 * @see /utils/cart
 * @see /utils/format
 * @see /ProductImage.jsx
 */
export default function CartItem({ item, onCambiar, onQuitar }) {

  // Estado que almacena la cantidad escrita en el campo de entrada.
  const [valor, setValor] = useState(String(item.cantidad))

  // Estado que almacena el mensaje de error de validación.
  const [error, setError] = useState('')

  // Sincroniza el campo de cantidad cuando cambia el producto.
  useEffect(() => {
    setValor(String(item.cantidad))
  }, [item.cantidad])

  /**
   * Valida y aplica una nueva cantidad al producto.
   *
   * Comprueba que el campo no esté vacío y que la cantidad
   * sea válida según las existencias disponibles.
   *
   * @param {string} texto Cantidad introducida por el usuario.
   * @return {void} Actualiza el estado o muestra un error.
   */
  function aplicar(texto) {
    // Actualiza el valor visible del campo.
    setValor(texto)

    // Comprueba si el campo está vacío.
    if (texto === '') {
      setError('Escribe una cantidad.')
      return
    }

    // Valida la cantidad utilizando el stock disponible.
    const resultado = validarCantidad(Number(texto), item.stock)

    // Si la cantidad no es válida, muestra el error correspondiente.
    if (!resultado.valida) {
      setError(resultado.error)
      return
    }

    // Limpia los errores y actualiza la cantidad del producto.
    setError('')
    onCambiar(item.id, Number(texto))
  }

  /**
   * Gestiona la salida del campo de cantidad.
   *
   * Si existe un error, restaura la cantidad válida anterior
   * y limpia el mensaje de error.
   *
   * @return {void}
   */
  function manejarBlur() {
    if (error) {
      setValor(String(item.cantidad))
      setError('')
    }
  }

  // Genera un identificador único para el campo de cantidad.
  const idInput = `cantidad-${item.id}`

  return (
    <li className="cart-item">

      {/* Muestra la imagen del producto */}
      <ProductImage
        id={item.id}
        nombre={item.nombre}
        imagen={item.imagen}
        size="thumb"
        decorativo
      />

      <div className="cart-item__main">

        {/* Nombre del producto y botón para eliminarlo */}
        <div className="cart-item__head">

          {/* Enlace a la página de detalles del producto */}
          <Link to={`/producto/${item.id}`}>
            {item.nombre}
          </Link>

          {/* Elimina el producto del carrito */}
          <button
            type="button"
            className="icon-btn"
            onClick={() => onQuitar(item.id)}
            aria-label={`Quitar ${item.nombre} del carrito`}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Muestra el precio unitario del producto */}
        <span className="muted">
          {formatearMoneda(item.precio)} c/u
        </span>

        <div className="cart-item__row">

          {/* Grupo de controles para modificar la cantidad */}
          <div
            className="stepper"
            role="group"
            aria-label={`Cantidad de ${item.nombre}`}
          >

            {/* Disminuye la cantidad en una unidad */}
            <button
              type="button"
              onClick={() => aplicar(String(item.cantidad - 1))}
              disabled={item.cantidad <= 1}
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} aria-hidden="true" />
            </button>

            {/* Campo para introducir la cantidad deseada */}
            <input
              id={idInput}
              type="number"
              min="1"
              max={item.stock}
              step="1"
              value={valor}
              onChange={(e) => aplicar(e.target.value)}
              onBlur={manejarBlur}
              aria-label="Cantidad"
              aria-invalid={Boolean(error)}
              aria-describedby={
                error ? `${idInput}-error` : undefined
              }
            />

            {/* Aumenta la cantidad en una unidad */}
            <button
              type="button"
              onClick={() => aplicar(String(item.cantidad + 1))}
              disabled={item.cantidad >= item.stock}
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Calcula y muestra el subtotal del producto */}
          <strong>
            {formatearMoneda(
              redondear(item.precio * item.cantidad)
            )}
          </strong>
        </div>

        {/* Muestra el error y lo anuncia a las tecnologías de asistencia */}
        {error && (
          <p
            id={`${idInput}-error`}
            className="error"
            role="alert"
          >
            {error}
          </p>
        )}

      </div>
    </li>
  )
}
