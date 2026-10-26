
import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import { CATEGORIAS, FONDO_DEFECTO } from '../utils/visuals'

/**
 * Componente que muestra la imagen de un producto.
 * Si la imagen no existe, contiene un marcador de posición o falla al cargar,
 * muestra un icono representativo de su categoría con un fondo predeterminado.
 * También permite configurar el tamaño y el comportamiento accesible de la imagen.
 *
 * @author Ana Santillan
 * @version 1.0
 * @param {Object} props - Propiedades de configuración del componente.
 * @param {string} props.nombre - Nombre del producto, utilizado como texto alternativo.
 * @param {string} props.imagen - URL o ruta de la imagen del producto.
 * @param {string} [props.categoria] - Categoría del producto para seleccionar el icono y el fondo.
 * @param {string} [props.size='card'] - Tamaño visual de la imagen.
 * @param {boolean} [props.decorativo=false] - Indica si la imagen es decorativa y debe ocultarse a tecnologías de asistencia.
 * @returns {JSX.Element} Imagen del producto o una representación visual alternativa.
 * @see CATEGORIAS
 * @see FONDO_DEFECTO
 */
export default function ProductImage({
  nombre,
  imagen,
  categoria: nombreCategoria,
  size = 'card',
  decorativo = false,
}) {
  const [fallo, setFallo] = useState(false)
  const clase = `pimg pimg--${size}`

  /**
   * Restablece el estado de error cuando cambia la imagen del producto.
   *
   * @returns {void} No devuelve ningún valor.
   */
  useEffect(() => {
    setFallo(false)
  }, [imagen])

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

  const accesibilidad = decorativo
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': nombre }

  return (
    <div
      className={clase}
      style={{ background: categoria?.fondo ?? FONDO_DEFECTO }}
      {...accesibilidad}
    >
      <Icono strokeWidth={1.25} aria-hidden="true" />
    </div>
  )
}
