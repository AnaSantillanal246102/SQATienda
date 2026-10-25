import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import ProductImage from './ProductImage'
import { redondear, validarCantidad } from '../utils/cart'
import { formatearMoneda } from '../utils/format'

export default function CartItem({ item, onCambiar, onQuitar }) {
  const [valor, setValor] = useState(String(item.cantidad))
  const [error, setError] = useState('')

  useEffect(() => {
    setValor(String(item.cantidad))
  }, [item.cantidad])

  function aplicar(texto) {
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
    if (error) {
      setValor(String(item.cantidad))
      setError('')
    }
  }

  const idInput = `cantidad-${item.id}`

  return (
    <li className="cart-item">
      <ProductImage id={item.id} nombre={item.nombre} imagen={item.imagen} size="thumb" decorativo />
      <div className="cart-item__main">
        <div className="cart-item__head">
          <Link to={`/producto/${item.id}`}>{item.nombre}</Link>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onQuitar(item.id)}
            aria-label={`Quitar ${item.nombre} del carrito`}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <span className="muted">{formatearMoneda(item.precio)} c/u</span>
        <div className="cart-item__row">
          <div className="stepper" role="group" aria-label={`Cantidad de ${item.nombre}`}>
            <button type="button" onClick={() => aplicar(String(item.cantidad - 1))} disabled={item.cantidad <= 1} aria-label="Disminuir cantidad">
              <Minus size={16} aria-hidden="true" />
            </button>
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
              aria-describedby={error ? `${idInput}-error` : undefined}
            />
            <button type="button" onClick={() => aplicar(String(item.cantidad + 1))} disabled={item.cantidad >= item.stock} aria-label="Aumentar cantidad">
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
          <strong>{formatearMoneda(redondear(item.precio * item.cantidad))}</strong>
        </div>
        {error && (
          <p id={`${idInput}-error`} className="error" role="alert">{error}</p>
        )}
      </div>
    </li>
  )
}