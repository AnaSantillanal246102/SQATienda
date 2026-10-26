/**
 * @author Ana Paula Santillan Nuñez
 * @version 1.0.0
 */

/**
 * Instancia de formato para moneda mexicana (MXN).
 */
const formato = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

/**
 * Formatea un número dado a una cadena de texto con formato de moneda MXN.
 * @param {number} n El número que se desea formatear como moneda.
 * @return {string} La cadena de texto con el formato de moneda mexicana aplicado.
 */
export function formatearMoneda(n) {
  return formato.format(n)
}

/**
 * Determina el estado del stock de un producto según su cantidad disponible.
 * @param {number} stock La cantidad de stock disponible del producto.
 * @return {Object} Un objeto con el tipo, etiqueta y descripción de disponibilidad del stock.
 */
export function estadoStock(stock) {
  if (stock <= 0) {
    return { tipo: 'agotado', etiqueta: 'Agotado', disponibilidad: 'No disponible' }
  }
  const disponibilidad = stock === 1 ? '1 disponible' : `${stock} disponibles`
  if (stock <= 4) return { tipo: 'bajo', etiqueta: `Últimas ${stock}`, disponibilidad }
  return { tipo: 'ok', etiqueta: null, disponibilidad }
}