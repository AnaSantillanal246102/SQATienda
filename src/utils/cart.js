/**
 * @author Ana Paula Santillan Nuñez
 * @version 1.0.0
 */

/**
 * Tasa de IVA estándar aplicable.
 */
export const IVA = 0.16

/**
 * Redondea un número a dos decimales utilizando EPSILON para mayor precisión.
 * @param {number} n El número que se desea redondear.
 * @return {number} El número redondeado a dos decimales.
 */
export function redondear(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/**
 * Calcula el subtotal, el IVA y el total de una lista de elementos en el carrito.
 * @param {Array} items Lista de elementos del carrito con precio y cantidad.
 * @return {Object} Un objeto que contiene los campos subtotal, iva y total.
 */
export function calcularTotales(items) {
  const centavos = items.reduce((suma, i) => suma + Math.round(i.precio * 100) * i.cantidad, 0)
  const subtotal = centavos / 100
  const iva = redondear(subtotal * IVA)
  const total = redondear(subtotal + iva)
  return { subtotal, iva, total }
}

/**
 * Valida los elementos del carrito contra el catálogo de productos disponible.
 * @param {Array} items Elementos actuales en el carrito.[cite: 1]
 * @param {Array} productos Catálogo de productos disponibles con stock e ID.
 * @return {Array<string>} Una lista de mensajes con los problemas encontrados, si los hay.
 */
export function validarCarrito(items, productos) {
  const problemas = []
  for (const item of items) {
    const p = productos.find((x) => x.id === item.id)
    if (!p) problemas.push(`"${item.nombre}" ya no está en el catálogo.`)
    else if (p.stock < 1) problemas.push(`"${p.nombre}" se agotó.`)
    else if (!Number.isInteger(item.cantidad) || item.cantidad < 1)
      problemas.push(`La cantidad de "${p.nombre}" no es válida.`)
    else if (item.cantidad > p.stock)
      problemas.push(`Solo hay ${p.stock} unidad(es) de "${p.nombre}".`)
  }
  return problemas
}

/**
 * Valida una cantidad específica de un producto en relación con su stock disponible.
 * @param {number} cantidad Cantidad que se desea validar.
 * @param {number} stock Stock disponible del producto.
 * @return {Object} Un objeto con el resultado de la validación ({ valida, error }).
 */
export function validarCantidad(cantidad, stock) {
  if (!Number.isInteger(cantidad)) {
    return { valida: false, error: 'La cantidad debe ser un número entero.' }
  }
  if (cantidad < 1) {
    return { valida: false, error: 'La cantidad mínima es 1.' }
  }
  if (stock <= 0) {
    return { valida: false, error: 'Producto agotado.' }
  }
  if (cantidad > stock) {
    return { valida: false, error: `Solo hay ${stock} unidad(es) disponible(s).` }
  }
  return { valida: true, error: null }
}