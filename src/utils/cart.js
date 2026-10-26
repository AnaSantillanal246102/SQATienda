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
  const centavos = items.reduce(
    (suma, item) =>
      suma + Math.round(Number(item.precio) * 100) * item.cantidad,
    0
  )

  const subtotal = centavos / 100
  const iva = redondear(subtotal * IVA)
  const total = redondear(subtotal + iva)

  return { subtotal, iva, total }
}

// Valida que los artículos del carrito sigan disponibles
export function validarCarrito(items, productos) {
  const problemas = []

  // Evita llamar .find() sobre una respuesta que no sea un arreglo
  if (!Array.isArray(items) || !Array.isArray(productos)) {
    return ['No se pudo validar el carrito. Verifica los productos cargados.']
  }

  for (const item of items) {
    const producto = productos.find(
      (p) => String(p.id) === String(item.id)
    )

    if (!producto) {
      problemas.push(
        `"${item.nombre}" ya no está en el catálogo.`
      )
      continue
    }

    const stock = Number(producto.stock)
    const cantidad = Number(item.cantidad)

    if (!Number.isFinite(stock) || stock < 1) {
      problemas.push(`"${producto.nombre}" se agotó.`)
    } else if (!Number.isInteger(cantidad) || cantidad < 1) {
      problemas.push(
        `La cantidad de "${producto.nombre}" no es válida.`
      )
    } else if (cantidad > stock) {
      problemas.push(
        `Solo hay ${stock} unidad(es) de "${producto.nombre}".`
      )
    }
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
    return {
      valida: false,
      error: 'La cantidad debe ser un número entero.',
    }
  }

  if (cantidad < 1) {
    return {
      valida: false,
      error: 'La cantidad mínima es 1.',
    }
  }

  if (stock <= 0) {
    return {
      valida: false,
      error: 'Producto agotado.',
    }
  }

  if (cantidad > stock) {
    return {
      valida: false,
      error: `Solo hay ${stock} unidad(es) disponible(s).`,
    }
  }

  return { valida: true, error: null }
}
