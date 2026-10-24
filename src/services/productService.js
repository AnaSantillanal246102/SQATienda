import productos from '../data/products.json'

export function obtenerProductos() {
  return productos
}

export function obtenerProductoPorId(id) {
  return productos.find((p) => p.id === Number(id)) ?? null
}

export function obtenerCategorias() {
  return [...new Set(productos.map((p) => p.categoria))]
}

export function buscarProductos({ texto = '', categoria = '' } = {}) {
  const t = texto.trim().toLowerCase()
  return productos.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      (!t || p.nombre.toLowerCase().includes(t))
  )
}