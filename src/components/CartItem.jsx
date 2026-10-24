import { useState } from 'react'
import { Link } from 'react-router-dom'
import { redondear, validarCantidad } from '../utils/cart'
import { formatearMoneda } from '../utils/format'

export default function CartItem({ item, onCambiar, onQuitar }) {
  const [valor, setValor] = useState(String(item.cantidad))
  const [error, setError] = useState('')

  function manejarCambio(e) {
    const texto = e.target.value
    setValor(texto)
    if (texto === '') {
      setError('Escribe una cantidad.')
      return
    }
    const resultado = validarCantidad(Number(texto), item.stock)
    if (!resultado.valida) {
      setError(resultado.error)
      return
    }
    setError('')
    onCambiar(item.id, Number(texto))
  }

  function manejarBlur() {
    // Si se queda con un valor inválido, volvemos a la última cantidad buena
    if (error) {
      setValor(String(item.cantidad))
      setError('')
    }
  }

  const idInput = `cantidad-${item.id}`

  return (
    <li className="cart-item">
      <img src={item.imagen} alt="" className="cart-item__img" />
      <div className="cart-item__info">
        <Link to={`/producto/${item.id}`}>{item.nombre}</Link>
        <span className="muted">{formatearMoneda(item.precio)} c/u</span>
      </div>
      <div className="field cart-item__qty">
        <label htmlFor={idInput}>Cantidad</label>
        <input
          id={idInput}
          type="number"
          min="1"
          max={item.stock}
          step="1"
          value={valor}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${idInput}-error` : undefined}
        />
        {error && (
          <p id={`${idInput}-error`} className="error" role="alert">
            {error}
          </p>
        )}
      </div>
      <strong className="cart-item__total">
        {formatearMoneda(redondear(item.precio * item.cantidad))}
      </strong>
      <button
        className="btn btn--secondary"
        onClick={() => onQuitar(item.id)}
        aria-label={`Quitar ${item.nombre} del carrito`}
      >
        Quitar
      </button>
    </li>
  )
}