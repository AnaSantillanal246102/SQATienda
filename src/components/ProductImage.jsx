import { useState } from 'react'
import { Package } from 'lucide-react'
import { CATEGORIAS, FONDO_DEFECTO } from '../utils/visuals'

export default function ProductImage({ nombre, imagen, categoria: nombreCategoria, size = 'card', decorativo = false }) {
  const [fallo, setFallo] = useState(false)
  const clase = `pimg pimg--${size}`

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

  const categoria = CATEGORIAS[nombreCategoria]
  const Icono = categoria?.Icono ?? Package
  const accesibilidad = decorativo ? { 'aria-hidden': true } : { role: 'img', 'aria-label': nombre }

  return (
    <div className={clase} style={{ background: categoria?.fondo ?? FONDO_DEFECTO }} {...accesibilidad}>
      <Icono strokeWidth={1.25} aria-hidden="true" />
    </div>
  )
}