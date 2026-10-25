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

  it('todos los productos tienen precio positivo y stock entero no negativo', () => {
    for (const p of obtenerProductos()) {
      expect(p.precio).toBeGreaterThan(0)
      expect(Number.isInteger(p.stock) && p.stock >= 0).toBe(true)
    }
  })

  it('no hay ids repetidos', () => {
    const ids = obtenerProductos().map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('devuelve null si el id no existe', () => {
    expect(obtenerProductoPorId(9999)).toBeNull()
  })

  it('encuentra un producto por id, incluso si llega como texto', () => {
    expect(obtenerProductoPorId('1').nombre).toBe('NovaBook Ultra 17')
  })

  it('devuelve 6 categorías', () => {
    expect(obtenerCategorias()).toHaveLength(6)
  })

  it('busca por categoría o descripción, no solo por nombre', () => {
    expect(buscarProductos({ texto: 'laptop' })).toHaveLength(6)
  })

  it('ignora mayúsculas', () => {
    expect(buscarProductos({ texto: 'MONITOR' })).toHaveLength(5)
  })

  it('ignora acentos', () => {
    expect(buscarProductos({ texto: 'audifonos' })).toHaveLength(1)
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