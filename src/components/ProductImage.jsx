import { Package } from 'lucide-react'
import { obtenerProductoPorId } from '../services/productService'
import { CATEGORIAS, FONDO_DEFECTO } from '../utils/visuals'

export default function ProductImage({ id, nombre, imagen, size = 'card', decorativo = false }) {
  const clase = `pimg pimg--${size}`

  // Si el producto tiene una foto real, se usa
  if (imagen && !imagen.includes('placeholder')) {
    return <img src={imagen} alt={decorativo ? '' : nombre} className={clase} />
  }

  const categoria = CATEGORIAS[obtenerProductoPorId(id)?.categoria]
  const Icono = categoria?.Icono ?? Package
  const accesibilidad = decorativo ? { 'aria-hidden': true } : { role: 'img', 'aria-label': nombre }

  return (
    <div className={clase} style={{ background: categoria?.fondo ?? FONDO_DEFECTO }} {...accesibilidad}>
      <Icono strokeWidth={1.25} aria-hidden="true" />
    </div>
  )
}