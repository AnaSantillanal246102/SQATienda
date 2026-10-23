const formato = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function formatearMoneda(n) {
  return formato.format(n)
}