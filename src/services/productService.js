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

export function obtenerDestacados() {
  return productos.filter((p) => p.destacado)
}

export function ordenarProductos(lista, criterio = 'nombre') {
  const copia = [...lista]
  if (criterio === 'precio-asc') return copia.sort((a, b) => a.precio - b.precio)
  if (criterio === 'precio-desc') return copia.sort((a, b) => b.precio - a.precio)
  return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}