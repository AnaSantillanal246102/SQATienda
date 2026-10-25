export const IVA = 0.16

export function redondear(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function calcularTotales(items) {
  const centavos = items.reduce((suma, i) => suma + Math.round(i.precio * 100) * i.cantidad, 0)
  const subtotal = centavos / 100
  const iva = redondear(subtotal * IVA)
  const total = redondear(subtotal + iva)
  return { subtotal, iva, total }
}

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