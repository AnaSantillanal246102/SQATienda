import { obtenerProductoPorId } from '../services/productService'
import { CATEGORIAS, EMOJI_PRODUCTO, FONDO_DEFECTO } from '../utils/visuals'

export default function ProductImage({ id, nombre, imagen, size = 'card', decorativo = false }) {
  const clase = `pimg pimg--${size}`

  // Si el producto tiene una foto real, se usa
  if (imagen && !imagen.includes('placeholder')) {
    return <img src={imagen} alt={decorativo ? '' : nombre} className={clase} />
  }

  const producto = obtenerProductoPorId(id)
  const fondo = CATEGORIAS[producto?.categoria]?.fondo ?? FONDO_DEFECTO
  const accesibilidad = decorativo
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': nombre }

  return (
    <div className={clase} style={{ background: fondo }} {...accesibilidad}>
      <span aria-hidden="true">{EMOJI_PRODUCTO[id] ?? '🛍️'}</span>
    </div>
  )
}