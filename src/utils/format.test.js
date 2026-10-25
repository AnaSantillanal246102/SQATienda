import { describe, it, expect } from 'vitest'
import { estadoStock } from './format'

describe('estadoStock (valores límite 0, 1, 4, 5)', () => {
  it.each([
    [0, 'agotado'],
    [1, 'bajo'],
    [4, 'bajo'],
    [5, 'ok'],
  ])('stock %s → %s', (stock, tipo) => {
    expect(estadoStock(stock).tipo).toBe(tipo)
  })

  it('usa singular con una unidad', () => {
    expect(estadoStock(1).disponibilidad).toBe('1 disponible')
  })
})