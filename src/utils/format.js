const formato = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function formatearMoneda(n) {
  return formato.format(n)
}

export function estadoStock(stock) {
  if (stock <= 0) {
    return { tipo: 'agotado', etiqueta: 'Agotado', disponibilidad: 'No disponible' }
  }
  const disponibilidad = stock === 1 ? '1 disponible' : `${stock} disponibles`
  if (stock <= 4) return { tipo: 'bajo', etiqueta: `Últimas ${stock}`, disponibilidad }
  return { tipo: 'ok', etiqueta: null, disponibilidad }
}