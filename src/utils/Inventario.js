/**
 * @author Jared Martínez Coyolt
 * @version 1.0.0
 */


/**
 * Determina el estado actual del stock de un producto basándose en su cantidad y stock mínimo.
 * @param {Object} p Objeto que contiene las propiedades del producto (stock y stock_minimo).
 * @return {Object} Un objeto con la clase CSS y el texto descriptivo del estado del stock.
 */
export function estadoStock(p) {
  if (p.stock === 0) return { clase: 'agotado', texto: 'Agotado' }
  if (p.stock <= p.stock_minimo) return { clase: 'bajo', texto: 'Stock bajo' }
  return { clase: 'ok', texto: 'Disponible' }
}


/**
 * Calcula el stock resultante que quedará tras realizar un movimiento. En un ajuste, la cantidad es el conteo físico.
 * @param {number} actual El stock actual antes del movimiento.
 * @param {string} tipo El tipo de movimiento (ej. 'entrada', 'salida').
 * @param {number} cantidad La cantidad involucrada en el movimiento o conteo físico.
 * @return {number} El nuevo stock resultante calculado.
 */
export function stockResultante(actual, tipo, cantidad) {
  if (tipo === 'entrada') return actual + cantidad
  if (tipo === 'salida') return actual - cantidad
  return cantidad
}

/**
 * Calcula el cambio de stock que provocó un movimiento. Utiliza el movimiento anterior si se trata de un ajuste.
 * @param {Object} mov Objeto que representa el movimiento actual.
 * @param {Object} [anterior] Objeto que representa el movimiento previo (más antiguo).
 * @return {number|null} El valor numérico de la variación o null si no se puede determinar.
 */
export function variacion(mov, anterior) {
  if (mov.tipo === 'entrada') return mov.cantidad
  if (mov.tipo === 'salida') return -mov.cantidad
  return anterior ? mov.stock_resultante - anterior.stock_resultante : null
}

/**
 * Formatea el valor de la variación para su visualización en la interfaz.
 * @param {number|null} v El valor numérico de la variación.
 * @return {string} Una cadena formateada con el signo correspondiente o un guion si es nulo.
 */
export function formatearVariacion(v) {
  if (v === null) return '—'
  return v > 0 ? `+${v}` : String(v)
}