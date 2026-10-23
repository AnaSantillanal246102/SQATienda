export const IVA = 0.16

export function redondear(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function calcularTotales(items) {
  const subtotal = redondear(
    items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)
  )
  const iva = redondear(subtotal * IVA)
  const total = redondear(subtotal + iva)
  return { subtotal, iva, total }
}

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