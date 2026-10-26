// src/utils/inventario.js

export function estadoStock(p) {
  if (p.stock === 0) return { clase: 'agotado', texto: 'Agotado' }
  if (p.stock <= p.stock_minimo) return { clase: 'bajo', texto: 'Stock bajo' }
  return { clase: 'ok', texto: 'Disponible' }
}

// Stock que quedará tras el movimiento. En un ajuste, `cantidad` es el conteo físico.
export function stockResultante(actual, tipo, cantidad) {
  if (tipo === 'entrada') return actual + cantidad
  if (tipo === 'salida') return actual - cantidad
  return cantidad
}

// Cambio de stock que provocó un movimiento. `anterior` es el movimiento previo (más antiguo).
// En los ajustes el backend guarda la diferencia sin signo, así que se calcula con el stock anterior.
export function variacion(mov, anterior) {
  if (mov.tipo === 'entrada') return mov.cantidad
  if (mov.tipo === 'salida') return -mov.cantidad
  return anterior ? mov.stock_resultante - anterior.stock_resultante : null
}

export function formatearVariacion(v) {
  if (v === null) return '—'
  return v > 0 ? `+${v}` : String(v)
}