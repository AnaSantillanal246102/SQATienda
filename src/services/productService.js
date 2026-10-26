
// src/services/productService.js

/**
 * @file productService.js
 * @description Servicio encargado de consultar, buscar y ordenar
 * productos, categorías y productos destacados mediante la API
 * del backend.
 *
 * @author Ana Santillan
 * @author Jared Martinez
 * @version 1.0
 */

/**
 * URL base de la API del sistema.
 *
 * @type {string}
 */
const API_URL = 'http://localhost:3001/api'

/**
 * Obtiene todos los productos disponibles en el backend.
 *
 * Realiza una solicitud HTTP GET al endpoint de productos y
 * devuelve la información recibida en formato JSON.
 *
 * @async
 * @returns {Promise<Array<Object>>} Promesa que se resuelve con
 * un arreglo de productos.
 * @throws {Error} Si la respuesta HTTP no es satisfactoria.
 *
 * @see obtenerProductoPorId
 * @see buscarProductos
 * @see ordenarProductos
 */
export async function obtenerProductos() {
  const response = await fetch(`${API_URL}/productos`)

  if (!response.ok) {
    throw new Error('Error al obtener productos')
  }

  return response.json()
}

/**
 * Obtiene un producto específico mediante su identificador.
 *
 * Realiza una solicitud HTTP GET al endpoint correspondiente.
 * Si la respuesta HTTP no es satisfactoria, devuelve null.
 *
 * @async
 * @param {number|string} id Identificador del producto que
 * se desea consultar.
 * @returns {Promise<Object|null>} Promesa que se resuelve con
 * el objeto del producto o con null si la respuesta HTTP falla.
 *
 * @see obtenerProductos
 */
export async function obtenerProductoPorId(id) {
  const response = await fetch(`${API_URL}/productos/${id}`)

  if (!response.ok) {
    return null
  }

  return response.json()
}

/**
 * Obtiene las categorías disponibles en el sistema.
 *
 * Realiza una solicitud HTTP GET al endpoint de categorías
 * y devuelve los datos recibidos en formato JSON.
 *
 * @async
 * @returns {Promise<Array<string>>} Promesa que se resuelve
 * con un arreglo de categorías.
 * @throws {Error} Si la respuesta HTTP no es satisfactoria.
 *
 * @see obtenerProductos
 */
export async function obtenerCategorias() {
  const response = await fetch(`${API_URL}/categorias`)

  if (!response.ok) {
    throw new Error('Error al obtener categorías')
  }

  return response.json()
}

/**
 * Obtiene los productos destacados del catálogo.
 *
 * Realiza una solicitud HTTP GET al endpoint de productos
 * destacados y devuelve los resultados en formato JSON.
 *
 * @async
 * @returns {Promise<Array<Object>>} Promesa que se resuelve
 * con un arreglo de productos destacados.
 * @throws {Error} Si la respuesta HTTP no es satisfactoria.
 *
 * @see obtenerProductos
 */
export async function obtenerDestacados() {
  const response = await fetch(`${API_URL}/productos/destacados`)

  if (!response.ok) {
    throw new Error('Error al obtener destacados')
  }

  return response.json()
}

/**
 * Normaliza una cadena de texto para facilitar las búsquedas.
 *
 * Convierte el texto a minúsculas y elimina las marcas diacríticas
 * de los caracteres, permitiendo buscar palabras con o sin acentos.
 *
 * @param {string} texto Texto que se desea normalizar.
 * @returns {string} Texto en minúsculas y sin marcas diacríticas.
 *
 * @see buscarProductos
 */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Busca productos por texto y categoría.
 *
 * Obtiene todos los productos del backend y filtra los resultados
 * en el cliente según el texto y la categoría proporcionados.
 *
 * La búsqueda considera el nombre, la categoría y la descripción
 * del producto, ignorando las diferencias entre mayúsculas
 * y minúsculas, así como los acentos.
 *
 * @async
 * @param {Object} [opciones={}] Opciones para filtrar productos.
 * @param {string} [opciones.texto=''] Texto que se buscará en
 * el nombre, la categoría y la descripción.
 * @param {string} [opciones.categoria=''] Categoría por la que
 * se filtrarán los productos. Si está vacía, no se aplica este
 * filtro.
 * @returns {Promise<Array<Object>>} Promesa que se resuelve con
 * el arreglo de productos que coinciden con los filtros.
 * @throws {Error} Si falla la consulta realizada por
 * obtenerProductos.
 *
 * @see obtenerProductos
 * @see normalizar
 * @see ordenarProductos
 */
export async function buscarProductos({
  texto = '',
  categoria = '',
} = {}) {
  const productos = await obtenerProductos()
  const t = normalizar(texto.trim())

  return productos.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      (!t ||
        normalizar(
          `${p.nombre} ${p.categoria} ${p.descripcion}`
        ).includes(t))
  )
}

/**
 * Ordena una lista de productos según el criterio indicado.
 *
 * Crea una copia de la lista original para evitar modificar
 * directamente el arreglo recibido.
 *
 * Permite ordenar por nombre alfabéticamente, por precio
 * ascendente o por precio descendente.
 *
 * @param {Array<Object>} lista Lista de productos que se ordenará.
 * @param {'nombre'|'precio-asc'|'precio-desc'} [criterio='nombre']
 * Criterio de ordenamiento:
 * - nombre: orden alfabético según el nombre del producto.
 * - precio-asc: orden de menor a mayor precio.
 * - precio-desc: orden de mayor a menor precio.
 * @returns {Array<Object>} Nueva lista de productos ordenada.
 *
 * @see obtenerProductos
 * @see buscarProductos
 */
export function ordenarProductos(lista, criterio = 'nombre') {
  const copia = [...lista]

  if (criterio === 'precio-asc') {
    return copia.sort((a, b) => a.precio - b.precio)
  }

  if (criterio === 'precio-desc') {
    return copia.sort((a, b) => b.precio - a.precio)
  }

  return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}
