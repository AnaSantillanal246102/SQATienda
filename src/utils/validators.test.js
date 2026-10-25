import { describe, it, expect } from 'vitest'
import {
  validarNombre,
  validarEmail,
  validarTelefono,
  validarCP,
  validarCliente,
  validarEstado,
} from './validators'

describe('validarNombre', () => {
  it.each([
    ['', false],
    ['   ', false],
    ['Al', false],
    ['Ana', true],
    ['Ana López', true],
    ['José Ñandú', true],
    ['Juan123', false],
  ])('"%s" → válido: %s', (valor, valido) => {
    expect(validarNombre(valor) === null).toBe(valido)
  })
})

describe('validarEmail', () => {
  it.each([
    ['', false],
    ['ana', false],
    ['ana@', false],
    ['ana@correo', false],
    ['ana @correo.com', false],
    ['ana@correo.com', true],
    ['ana.lopez@mail.com.mx', true],
  ])('"%s" → válido: %s', (valor, valido) => {
    expect(validarEmail(valor) === null).toBe(valido)
  })
})

describe('validarTelefono (valores límite: 9, 10 y 11 dígitos)', () => {
  it.each([
    ['', false],
    ['123456789', false],
    ['1234567890', true],
    ['12345678901', false],
    ['656 123 4567', true],
    ['656-123-4567', true],
    ['65612345ab', false],
  ])('"%s" → válido: %s', (valor, valido) => {
    expect(validarTelefono(valor) === null).toBe(valido)
  })
})

describe('validarCP (valores límite: 4, 5 y 6 dígitos)', () => {
  it.each([
    ['', false],
    ['3200', false],
    ['32000', true],
    ['320000', false],
    ['32a00', false],
  ])('"%s" → válido: %s', (valor, valido) => {
    expect(validarCP(valor) === null).toBe(valido)
  })
})

describe('validarCliente', () => {
  const valido = {
    nombre: 'Ana López',
    email: 'ana@correo.com',
    telefono: '6561234567',
    direccion: 'Av. Juárez 123',
    ciudad: 'Ciudad Juárez',
    cp: '32000',
    estado: 'Chihuahua',
  }

  it('no devuelve errores con datos correctos', () => {
    expect(validarCliente(valido)).toEqual({})
  })

  it('devuelve un error por cada campo vacío', () => {
    const errores = validarCliente({})
    expect(Object.keys(errores)).toHaveLength(7)
  })

  it('solo marca el campo incorrecto', () => {
    expect(Object.keys(validarCliente({ ...valido, cp: '12' }))).toEqual(['cp'])
  })
})

describe('validarEstado', () => {
  it.each([
    ['', false],
    ['Sol', false],
    ['Sonora', true],
    ['Chihuahua', true],
    ['Sonora1', false],
  ])('"%s" → válido: %s', (valor, valido) => {
    expect(validarEstado(valor) === null).toBe(valido)
  })
})