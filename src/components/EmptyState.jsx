
/**
 * Componente que muestra un estado vacío en la interfaz.
 *
 * Presenta una imagen decorativa, un título y contenido adicional.
 * Se utiliza cuando no hay información que mostrar, por ejemplo,
 * cuando el carrito está vacío o no se encuentran resultados.
 *
 * @author Ana Santillan
 * @version 1.0
 * @since 1.0
 * @param {Object} props Propiedades recibidas por el componente.
 * @param {string} props.titulo Texto que se mostrará como título.
 * @param {string} [props.as='h2'] Etiqueta HTML utilizada para el título.
 * @param {import('react').ReactNode} props.children Contenido adicional.
 * @return {JSX.Element} Elemento visual que representa el estado vacío.
 */
export default function EmptyState({
  titulo,
  as: Titulo = 'h2',
  children
}) {
  return (
    <div className="empty">

      {/* Imagen decorativa que acompaña el estado vacío */}
      <img
        src="/img/robot.png"
        alt=""
        className="empty__robot"
        width="110"
        height="140"
      />

      {/* Muestra el título utilizando la etiqueta HTML seleccionada */}
      <Titulo>{titulo}</Titulo>

      {/* Muestra contenido adicional, como texto o botones */}
      {children}

    </div>
  )
}
