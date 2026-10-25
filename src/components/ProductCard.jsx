import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import ProductImage from './ProductImage'
import { useCart } from '../context/CartContext'
import { estadoStock, formatearMoneda } from '../utils/format'

export default function ProductCard({ producto }) {
  const { items, agregar } = useCart()
  const [agregado, setAgregado] = useState(false)
  const estado = estadoStock(producto.stock)
  const enCarrito = items.find((i) => i.id === producto.id)?.cantidad ?? 0
  const sinUnidades = producto.stock - enCarrito <= 0

  function manejarAgregar() {
    agregar(producto, 1)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  const etiquetaBoton =
    estado.tipo === 'agotado'
      ? `${producto.nombre}: agotado`
      : sinUnidades
        ? `${producto.nombre}: ya tienes todas las unidades en el carrito`
        : `Agregar ${producto.nombre} al carrito`

  return (
    <article className={`card${estado.tipo === 'agotado' ? ' card--out' : ''}`}>
      <Link to={`/producto/${producto.id}`} className="card__media" aria-label={`Ver detalle de ${producto.nombre}`}>
        <ProductImage id={producto.id} nombre={producto.nombre} imagen={producto.imagen} decorativo />
        {estado.etiqueta && <span className={`badge badge--${estado.tipo}`}>{estado.etiqueta}</span>}
      </Link>
      <div className="card__body">
        <h3 className="card__title">
          <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
        </h3>
        <p className="card__desc">{producto.descripcion}</p>
        <div className="card__foot">
          <div>
            <p className="card__price">{formatearMoneda(producto.precio)}</p>
            <p className={`stock stock--${estado.tipo}`}>{estado.disponibilidad}</p>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={manejarAgregar}
            disabled={sinUnidades}
            aria-label={etiquetaBoton}
          >
            {agregado ? <Check size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </article>
  )
}