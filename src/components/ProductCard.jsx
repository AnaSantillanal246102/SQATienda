import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import { formatearMoneda } from '../utils/format'

export default function ProductCard({ producto }) {
  const agotado = producto.stock === 0
  return (
    <article className={`card${agotado ? ' card--out' : ''}`}>
      <ProductImage id={producto.id} nombre={producto.nombre} imagen={producto.imagen} />
      <div className="card__body">
        <span className="card__cat">{producto.categoria}</span>
        <h3 className="card__title">{producto.nombre}</h3>
        <p className="card__price">{formatearMoneda(producto.precio)}</p>
        {agotado && <span className="badge badge--out">Agotado</span>}
        {!agotado && producto.stock <= 3 && (
          <span className="badge badge--low">Quedan {producto.stock}</span>
        )}
        <Link to={`/producto/${producto.id}`} className="btn btn--secondary">
          Ver detalle
        </Link>
      </div>
    </article>
  )
}
