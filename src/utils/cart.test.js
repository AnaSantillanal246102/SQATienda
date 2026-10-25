import { describe, it, expect } from 'vitest'
import { calcularTotales } from './cart'
import { validarCarrito } from './cart'

describe('calcularTotales', () => {
  it('devuelve ceros con carrito vacío', () => {
    expect(calcularTotales([])).toEqual({ subtotal: 0, iva: 0, total: 0 })
  })

  it('calcula subtotal, IVA 16% y total', () => {
    const items = [{ precio: 100, cantidad: 2 }]
    expect(calcularTotales(items)).toEqual({ subtotal: 200, iva: 32, total: 232 })
  })

  it('redondea a 2 decimales', () => {
    const items = [{ precio: 19.99, cantidad: 3 }]
    const { subtotal, iva, total } = calcularTotales(items)
    expect(subtotal).toBe(59.97)
    expect(iva).toBe(9.6)
    expect(total).toBe(69.57)
  })
})

describe('validarCarrito', () => {
  const catalogo = [
    { id: 1, nombre: 'A', stock: 5 },
    { id: 2, nombre: 'B', stock: 0 },
  ]
  const item = (id, cantidad) => ({ id, nombre: 'X', cantidad })

  it('no reporta problemas con un carrito válido', () => {
    expect(validarCarrito([item(1, 5)], catalogo)).toEqual([])
  })
  it('detecta cantidad mayor al stock (límite n+1)', () => {
    expect(validarCarrito([item(1, 6)], catalogo)).toHaveLength(1)
  })
  it('detecta productos agotados, inexistentes y cantidades inválidas', () => {
    expect(validarCarrito([item(2, 1)], catalogo)).toHaveLength(1)
    expect(validarCarrito([item(99, 1)], catalogo)).toHaveLength(1)
    expect(validarCarrito([item(1, 0)], catalogo)).toHaveLength(1)
  })
})