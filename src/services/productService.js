// src/services/productService.js

const API_URL = 'http://localhost:3001/api';

export async function obtenerProductos() {
  const response = await fetch(`${API_URL}/productos`);
  if (!response.ok) throw new Error('Error al obtener productos');
  return response.json();
}

export async function obtenerProductoPorId(id) {
  const response = await fetch(`${API_URL}/productos/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function obtenerCategorias() {
  const response = await fetch(`${API_URL}/categorias`);
  if (!response.ok) throw new Error('Error al obtener categorías');
  return response.json();
}

export async function obtenerDestacados() {
  const response = await fetch(`${API_URL}/productos/destacados`);
  if (!response.ok) throw new Error('Error al obtener destacados');
  return response.json();
}

// La búsqueda y ordenamiento se pueden seguir haciendo en el cliente
// después de obtener todos los productos.
function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export async function buscarProductos({ texto = '', categoria = '' } = {}) {
  const productos = await obtenerProductos();
  const t = normalizar(texto.trim());
  return productos.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      (!t || normalizar(`${p.nombre} ${p.categoria} ${p.descripcion}`).includes(t))
  );
}

export function ordenarProductos(lista, criterio = 'nombre') {
  const copia = [...lista];
  if (criterio === 'precio-asc') return copia.sort((a, b) => a.precio - b.precio);
  if (criterio === 'precio-desc') return copia.sort((a, b) => b.precio - a.precio);
  return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}