/**
 * @author Ana Paula Santillan Nuñez
 * @version 1.0.0
 */

/**
 * Expresión regular para validar que una cadena contenga solo letras, acentos, espacios, puntos y guiones.
 */
const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/

/**
 * Expresión regular para validar el formato básico de una dirección de correo electrónico.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Valida que el nombre ingresado no esté vacío, cumpla con la longitud mínima y contenga solo letras permitidas.
 * @param {string} valor El nombre que se desea validar.
 * @return {string|null} Un mensaje de error si la validación falla, o null si es válido.
 */
export function validarNombre(valor = '') {
  const v = valor.trim()
  if (!v) return 'El nombre es obligatorio.'
  if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (!SOLO_LETRAS.test(v)) return 'El nombre solo puede contener letras.'
  return null
}

/**
 * Valida que el correo electrónico no esté vacío y cumpla con el formato correcto.
 * @param {string} valor El correo electrónico que se desea validar.
 * @return {string|null} Un mensaje de error si la validación falla, o null si es válido.
 */
export function validarEmail(valor = '') {
  const v = valor.trim()
  if (!v) return 'El correo es obligatorio.'
  if (!EMAIL.test(v)) return 'Escribe un correo válido, por ejemplo nombre@correo.com.'
  return null
}

/**
 * Valida que el número de teléfono contenga exactamente 10 dígitos numéricos.
 * @param {string} valor El número de teléfono que se desea validar.
 * @return {string|null} Un mensaje de error si la validación falla, o null si es válido.
 */
export function validarTelefono(valor = '') {
  const v = valor.trim()
  if (!v) return 'El teléfono es obligatorio.'
  const digitos = v.replace(/[\s-]/g, '')
  if (!/^\d+$/.test(digitos)) return 'El teléfono solo puede contener números.'
  if (digitos.length !== 10) return 'El teléfono debe tener 10 dígitos.'
  return null
}

/**
 * Valida que la dirección no esté vacía y cumpla con la longitud mínima de caracteres.
 * @param {string} valor La dirección que se desea validar.
 * @return {string|null} Un mensaje de error si la validación falla, o null si es válido.
 */
export function validarDireccion(valor = '') {
  const v = valor.trim()
  if (!v) return 'La dirección es obligatoria.'
  if (v.length < 5) return 'Escribe calle y número (mínimo 5 caracteres).'
  return null
}

/**
 * Valida que el nombre de la ciudad no esté vacío y cumpla con la longitud mínima.
 * @param {string} valor La ciudad que se desea validar.
 * @return {string|null} Un mensaje de error si la validación falla, o null si es válido.
 */
export function validarCiudad(valor = '') {
  const v = valor.trim()
  if (!v) return 'La ciudad es obligatoria.'
  if (v.length < 2) return 'Escribe un nombre de ciudad válido.'
  return null
}

/**
 * Valida que el código postal consista exactamente de 5 dígitos numéricos.
 * @param {string} valor El código postal que se desea validar.
 * @return {string|null} Un mensaje de error si la validación falla, o null si es válido.
 */
export function validarCP(valor = '') {
  const v = valor.trim()
  if (!v) return 'El código postal es obligatorio.'
  if (!/^\d{5}$/.test(v)) return 'El código postal debe tener 5 dígitos.'
  return null
}

/**
 * Objeto que mapea los nombres de los campos con sus respectivas funciones de validación.
 */
const REGLAS = {
  nombre: validarNombre,
  email: validarEmail,
  telefono: validarTelefono,
  direccion: validarDireccion,
  ciudad: validarCiudad,
  cp: validarCP,
  estado: validarEstado,
}

/**
 * Valida un campo específico de acuerdo al valor proporcionado utilizando el diccionario de reglas.
 * @param {string} campo El nombre del campo a validar (ej. 'nombre', 'email').
 * @param {any} valor El valor correspondiente al campo.
 * @return {string|null} El mensaje de error resultante o null si pasa la validación.
 */
export function validarCampo(campo, valor) {
  return REGLAS[campo](valor)
}

/**
 * Valida un objeto completo con los datos del cliente, devolviendo un diccionario de errores si existen.
 * @param {Object} datos Objeto que contiene los datos del cliente a validar.
 * @return {Object} Un objeto clave-valor únicamente con los campos que presentaron errores. Retorna vacío si todo es válido.
 */
export function validarCliente(datos) {
  const errores = {}
  for (const campo of Object.keys(REGLAS)) {
    const error = REGLAS[campo](datos[campo])
    if (error) errores[campo] = error
  }
  return errores
}

/**
 * Valida que el nombre del estado no esté vacío, cumpla con la longitud y contenga solo letras.
 * @param {string} valor El nombre del estado que se desea validar.
 * @return {string|null} Un mensaje de error si la validación falla, o null si es válido.
 */
export function validarEstado(valor = '') {
  const v = valor.trim()
  if (!v) return 'El estado es obligatorio.'
  if (v.length < 4) return 'Escribe el nombre del estado.'
  if (!SOLO_LETRAS.test(v)) return 'El estado solo puede contener letras.'
  return null
}