import { useState } from 'react'
import { Package } from 'lucide-react'
import { obtenerProductoPorId } from '../services/productService'
import { CATEGORIAS, FONDO_DEFECTO } from '../utils/visuals'

export default function ProductImage({ id, nombre, imagen, size = 'card', decorativo = false }) {
  const [fallo, setFallo] = useState(false)
  const clase = `pimg pimg--${size}`

  // Si el producto tiene una foto real y carga bien, se usa
  if (imagen && !imagen.includes('placeholder') && !fallo) {
    return (
      <img
        src={imagen}
        alt={decorativo ? '' : nombre}
        className={clase}
        loading="lazy"
        onError={() => setFallo(true)}
      />
    )
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