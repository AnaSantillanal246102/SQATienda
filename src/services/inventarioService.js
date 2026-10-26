
// src/services/inventarioService.js

/**
 * @file inventarioService.js
 * @description Servicio encargado de realizar las solicitudes HTTP
 * al backend para consultar el inventario, obtener el historial
 * de movimientos y registrar nuevos movimientos de existencias.
 *
 * @author Jared Martinez
 * @version 1.0
 */

/**
 * URL base de la API de inventario.
 *
 * @type {string}
 */
const API_URL = 'http://localhost:3001/api/inventario'

/**
 * Obtiene la lista completa de productos del inventario.
 *
 * Realiza una solicitud GET al backend y devuelve los datos
 * recibidos en formato JSON.
 *
 * @async
 * @returns {Promise<Array<Object>>} Promesa que se resuelve
 * con un arreglo de productos del inventario.
 * @throws {Error} Si la respuesta HTTP no es satisfactoria.
 *
 * @see obtenerMovimientos
 * @see registrarMovimiento
 */
export async function obtenerInventario() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Error al obtener el inventario')
  }

  return response.json()
}

/**
 * Obtiene el historial de movimientos de un producto específico.
 *
 * Realiza una solicitud GET al endpoint correspondiente al
 * identificador del producto y devuelve los movimientos
 * registrados en formato JSON.
 *
 * @async
 * @param {number|string} productoId Identificador del producto
 * cuyo historial se desea consultar.
 * @returns {Promise<Array<Object>>} Promesa que se resuelve
 * con el arreglo de movimientos del producto.
 * @throws {Error} Si la respuesta HTTP no es satisfactoria.
 *
 * @see registrarMovimiento
 */
export async function obtenerMovimientos(productoId) {
  const response = await fetch(
    `${API_URL}/${productoId}/movimientos`
  )

  if (!response.ok) {
    throw new Error('Error al obtener el historial')
  }

  return response.json()
}

/**
 * Registra un movimiento de inventario en el backend.
 *
 * Envía los datos del movimiento mediante una solicitud POST
 * con contenido JSON.
 *
 * Si el backend devuelve un error, intenta recuperar su mensaje
 * y añade información sobre las existencias disponibles cuando
 * la respuesta incluye el campo stock.
 *
 * @async
 * @param {Object} datos Datos del movimiento que se registrará.
 * @param {number} datos.producto_id Identificador del producto.
 * @param {'entrada'|'salida'|'ajuste'} datos.tipo Tipo de movimiento.
 * @param {number} datos.cantidad Cantidad del movimiento o conteo
 * real en el caso de un ajuste.
 * @param {string} [datos.motivo] Motivo del movimiento (opcional).
 * @param {string} [datos.usuario] Responsable del movimiento
 * (opcional).
 * @returns {Promise<Object>} Promesa que se resuelve con la
 * respuesta del backend en formato JSON.
 * @throws {Error} Si el registro falla. El mensaje puede incluir
 * la causa del error y las existencias disponibles.
 *
 * @see obtenerInventario
 * @see obtenerMovimientos
 */
export async function registrarMovimiento(datos) {
  const response = await fetch(`${API_URL}/movimientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

  const cuerpo = await response.json().catch(() => ({}))

  if (!response.ok) {
    const detalle =
      cuerpo.stock !== undefined ? ` (hay ${cuerpo.stock})` : ''

    throw new Error(
      (cuerpo.error || 'Error al registrar el movimiento') + detalle
    )
  }

  return cuerpo
}
