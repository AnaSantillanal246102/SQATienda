
import { Check } from 'lucide-react'

/**
 * Lista de las etapas que conforman el proceso de compra.
 *
 * @author Ana Santillan
 * @version 1.0
 * @see StepIndicator
 */
const PASOS = ['Carrito', 'Datos', 'Revisión', 'Pago']

/**
 * Componente que muestra el progreso del proceso de compra.
 * Identifica cada etapa como completada, activa o pendiente,
 * según el número del paso actual. Incluye indicadores visuales
 * y atributos de accesibilidad para facilitar la navegación.
 *
 * @param {number} actual - Número del paso actual del proceso de compra, comenzando en 1.
 * @returns {JSX.Element} Lista ordenada con los pasos y su estado de progreso.
 * @see PASOS
 */
export default function StepIndicator({ actual }) {
  return (
    <ol className="stepper-nav" aria-label="Progreso de la compra">
      {PASOS.map((nombre, i) => {
        const n = i + 1
        const estado = n < actual ? 'done' : n === actual ? 'active' : 'todo'

        return (
          <li
            key={nombre}
            className={`sn sn--${estado}`}
            aria-current={n === actual ? 'step' : undefined}
          >
            <span className="sn__circle">
              {estado === 'done' ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                n
              )}
            </span>
            <span className="sn__label">{nombre}</span>
            {estado === 'done' && (
              <span className="sr-only">(completado)</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
