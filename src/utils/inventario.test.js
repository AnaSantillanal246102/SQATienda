import { describe, it, expect } from 'vitest'
import { estadoStock, stockResultante, variacion, formatearVariacion } from './inventario'

describe('estadoStock', () => {
  it('marca agotado cuando no hay existencias', () => {
    expect(estadoStock({ stock: 0, stock_minimo: 2 }).clase).toBe('agotado')
  })
  it('marca stock bajo cuando es igual o menor al mínimo', () => {
    expect(estadoStock({ stock: 2, stock_minimo: 2 }).clase).toBe('bajo')
    expect(estadoStock({ stock: 1, stock_minimo: 2 }).clase).toBe('bajo')
  })
  it('marca disponible por encima del mínimo', () => {
    expect(estadoStock({ stock: 3, stock_minimo: 2 }).clase).toBe('ok')
  })
})

describe('stockResultante', () => {
  it('suma en entradas y resta en salidas', () => {
    expect(stockResultante(5, 'entrada', 3)).toBe(8)
    expect(stockResultante(5, 'salida', 3)).toBe(2)
  })
  it('en ajustes usa el conteo físico', () => {
    expect(stockResultante(5, 'ajuste', 0)).toBe(0)
    expect(stockResultante(5, 'ajuste', 9)).toBe(9)
  })
  it('permite detectar stock insuficiente (resultado negativo)', () => {
    expect(stockResultante(2, 'salida', 999)).toBeLessThan(0)
  })
})

describe('variacion', () => {
  it('entradas suman y salidas restan', () => {
    expect(variacion({ tipo: 'entrada', cantidad: 4 }, null)).toBe(4)
    expect(variacion({ tipo: 'salida', cantidad: 4 }, null)).toBe(-4)
  })
  it('en ajustes calcula la diferencia con el movimiento anterior', () => {
    const mov = { tipo: 'ajuste', cantidad: 10, stock_resultante: 0 }
    expect(variacion(mov, { stock_resultante: 10 })).toBe(-10)
  })
  it('devuelve null si un ajuste no tiene movimiento anterior', () => {
    expect(variacion({ tipo: 'ajuste', cantidad: 5, stock_resultante: 5 }, undefined)).toBeNull()
  })
})

describe('formatearVariacion', () => {
  it('añade signo a positivos y muestra raya si no hay dato', () => {
    expect(formatearVariacion(3)).toBe('+3')
    expect(formatearVariacion(-3)).toBe('-3')
    expect(formatearVariacion(null)).toBe('—')
  })
})