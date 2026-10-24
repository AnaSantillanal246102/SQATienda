const PASOS = ['Carrito', 'Datos', 'Resumen', 'Pago']

export default function StepIndicator({ actual }) {
  return (
    <ol className="steps" aria-label="Progreso de la compra">
      {PASOS.map((nombre, i) => (
        <li
          key={nombre}
          className={i + 1 === actual ? 'steps__item steps__item--active' : i + 1 < actual ? 'steps__item steps__item--done' : 'steps__item'}
          aria-current={i + 1 === actual ? 'step' : undefined}
        >
          <span className="steps__num">{i + 1}</span> {nombre}
        </li>
      ))}
    </ol>
  )
}