const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validarNombre(valor = '') {
  const v = valor.trim()
  if (!v) return 'El nombre es obligatorio.'
  if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (!SOLO_LETRAS.test(v)) return 'El nombre solo puede contener letras.'
  return null
}

export function validarEmail(valor = '') {
  const v = valor.trim()
  if (!v) return 'El correo es obligatorio.'
  if (!EMAIL.test(v)) return 'Escribe un correo válido, por ejemplo nombre@correo.com.'
  return null
}

export function validarTelefono(valor = '') {
  const v = valor.trim()
  if (!v) return 'El teléfono es obligatorio.'
  const digitos = v.replace(/[\s-]/g, '')
  if (!/^\d+$/.test(digitos)) return 'El teléfono solo puede contener números.'
  if (digitos.length !== 10) return 'El teléfono debe tener 10 dígitos.'
  return null
}

export function validarDireccion(valor = '') {
  const v = valor.trim()
  if (!v) return 'La dirección es obligatoria.'
  if (v.length < 5) return 'Escribe calle y número (mínimo 5 caracteres).'
  return null
}

export function validarCiudad(valor = '') {
  const v = valor.trim()
  if (!v) return 'La ciudad es obligatoria.'
  if (v.length < 2) return 'Escribe un nombre de ciudad válido.'
  return null
}

export function validarCP(valor = '') {
  const v = valor.trim()
  if (!v) return 'El código postal es obligatorio.'
  if (!/^\d{5}$/.test(v)) return 'El código postal debe tener 5 dígitos.'
  return null
}

const REGLAS = {
  nombre: validarNombre,
  email: validarEmail,
  telefono: validarTelefono,
  direccion: validarDireccion,
  ciudad: validarCiudad,
  cp: validarCP,
  estado: validarEstado,
}

export function validarCampo(campo, valor) {
  return REGLAS[campo](valor)
}

// Devuelve un objeto solo con los campos que tienen error. {} = todo válido.
export function validarCliente(datos) {
  const errores = {}
  for (const campo of Object.keys(REGLAS)) {
    const error = REGLAS[campo](datos[campo])
    if (error) errores[campo] = error
  }
  return errores
}

export function validarEstado(valor = '') {
  const v = valor.trim()
  if (!v) return 'El estado es obligatorio.'
  if (v.length < 4) return 'Escribe el nombre del estado.'
  if (!SOLO_LETRAS.test(v)) return 'El estado solo puede contener letras.'
  return null
}