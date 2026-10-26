import { describe, it, expect } from 'vitest'
import { calcularTotales } from './cart'

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