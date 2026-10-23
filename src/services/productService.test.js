import { describe, it, expect } from 'vitest'
import {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerCategorias,
  buscarProductos,
} from './productService'

describe('productService', () => {
  it('tiene al menos 25 productos', () => {
    expect(obtenerProductos().length).toBeGreaterThanOrEqual(25)
  })

  it('devuelve null si el id no existe', () => {
    expect(obtenerProductoPorId(9999)).toBeNull()
  })

  it('encuentra un producto por id, incluso si llega como texto', () => {
    expect(obtenerProductoPorId('1').nombre).toContain('Audífonos')
  })

  it('devuelve 5 categorías', () => {
    expect(obtenerCategorias()).toHaveLength(5)
  })

  it('busca sin importar mayúsculas', () => {
    expect(buscarProductos({ texto: 'CABLE' })).toHaveLength(1)
  })

  it('combina búsqueda y categoría', () => {
    expect(buscarProductos({ texto: 'cable', categoria: 'Hogar' })).toHaveLength(0)
  })
})