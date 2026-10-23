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