
/**
 * Componente reutilizable para mostrar un campo de formulario.
 *
 * Muestra una etiqueta, un campo de entrada y un mensaje de error
 * cuando la validación detecta un problema.
 *
 * @author Ana Santillan
 * @version 1.0
 * @since 1.0
 * @param {Object} props Propiedades recibidas por el componente.
 * @param {string} props.id Identificador del campo.
 * @param {string} props.label Texto descriptivo de la etiqueta.
 * @param {string} [props.error] Mensaje de error opcional.
 * @return {JSX.Element} Campo de formulario con etiqueta y error opcional.
 */
export default function FormField({ id, label, error, ...props }) {
  return (
    <div className="field">
      {/* Etiqueta asociada al campo mediante su identificador */}
      <label htmlFor={id}>{label}</label>

      {/* Campo de entrada con soporte para propiedades adicionales */}
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />

      {/* Muestra el error y lo anuncia a las tecnologías de asistencia */}
      {error && (
        <p id={`${id}-error`} className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
