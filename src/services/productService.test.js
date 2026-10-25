import { describe, it, expect } from 'vitest'
import {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerCategorias,
  buscarProductos,
  obtenerDestacados,
  ordenarProductos,
} from './productService'

describe('productService', () => {
  it('tiene al menos 25 productos', () => {
    expect(obtenerProductos().length).toBeGreaterThanOrEqual(25)
  })

  it('devuelve null si el id no existe', () => {
    expect(obtenerProductoPorId(9999)).toBeNull()
  })

  it('encuentra un producto por id, incluso si llega como texto', () => {
    expect(obtenerProductoPorId('1').nombre).toBe('Aero Book Air 13')
  })

  it('devuelve 8 categorías', () => {
    expect(obtenerCategorias()).toHaveLength(8)
  })

  it('busca sin importar mayúsculas', () => {
    expect(buscarProductos({ texto: 'MONITOR' })).toHaveLength(4)
  })

  it('combina búsqueda y categoría', () => {
    expect(buscarProductos({ texto: 'monitor', categoria: 'Audio' })).toHaveLength(0)
  })

  it('hay exactamente 4 destacados', () => {
    expect(obtenerDestacados()).toHaveLength(4)
  })

  it('ordena por precio ascendente y descendente', () => {
    const asc = ordenarProductos(obtenerProductos(), 'precio-asc')
    const desc = ordenarProductos(obtenerProductos(), 'precio-desc')
    expect(asc.every((p, i) => i === 0 || asc[i - 1].precio <= p.precio)).toBe(true)
    expect(desc.every((p, i) => i === 0 || desc[i - 1].precio >= p.precio)).toBe(true)
  })

  it('no modifica la lista original al ordenar', () => {
    const original = obtenerProductos()
    const primero = original[0]
    ordenarProductos(original, 'precio-desc')
    expect(original[0]).toBe(primero)
  })
})