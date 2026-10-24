import { describe, it, expect } from 'vitest'
import { cartReducer } from './cartReducer'
import { validarCantidad } from './cart'

const cafetera = { id: 9, nombre: 'Cafetera', precio: 799, stock: 1, imagen: '' }
const cable = { id: 6, nombre: 'Cable', precio: 99.99, stock: 40, imagen: '' }

describe('cartReducer', () => {
  it('agrega un producto nuevo', () => {
    const r = cartReducer([], { type: 'AGREGAR', producto: cable, cantidad: 2 })
    expect(r).toHaveLength(1)
    expect(r[0].cantidad).toBe(2)
  })

  it('suma cantidades si el producto ya estaba', () => {
    let r = cartReducer([], { type: 'AGREGAR', producto: cable, cantidad: 2 })
    r = cartReducer(r, { type: 'AGREGAR', producto: cable, cantidad: 3 })
    expect(r[0].cantidad).toBe(5)
  })

  it('nunca supera el stock', () => {
    let r = cartReducer([], { type: 'AGREGAR', producto: cafetera, cantidad: 1 })
    r = cartReducer(r, { type: 'AGREGAR', producto: cafetera, cantidad: 1 })
    expect(r[0].cantidad).toBe(1)
  })

  it('no agrega productos agotados', () => {
    const agotado = { ...cable, stock: 0 }
    expect(cartReducer([], { type: 'AGREGAR', producto: agotado, cantidad: 1 })).toEqual([])
  })

  it('CAMBIAR respeta el mínimo 1 y el máximo de stock', () => {
    const base = cartReducer([], { type: 'AGREGAR', producto: cable, cantidad: 2 })
    expect(cartReducer(base, { type: 'CAMBIAR', id: 6, cantidad: 0 })[0].cantidad).toBe(1)
    expect(cartReducer(base, { type: 'CAMBIAR', id: 6, cantidad: 99 })[0].cantidad).toBe(40)
  })

  it('QUITAR y VACIAR funcionan', () => {
    const base = cartReducer([], { type: 'AGREGAR', producto: cable, cantidad: 1 })
    expect(cartReducer(base, { type: 'QUITAR', id: 6 })).toEqual([])
    expect(cartReducer(base, { type: 'VACIAR' })).toEqual([])
  })
})

describe('validarCantidad (valores límite con stock = 5)', () => {
  it.each([
    [0, false],
    [-1, false],
    [1.5, false],
    [NaN, false],
    [1, true],
    [5, true],
    [6, false],
  ])('cantidad %s → válida: %s', (cantidad, esperado) => {
    expect(validarCantidad(cantidad, 5).valida).toBe(esperado)
  })

  it('rechaza cualquier cantidad si el stock es 0', () => {
    expect(validarCantidad(1, 0).valida).toBe(false)
  })
})
describe('cartReducer · SINCRONIZAR', () => {
  const enCarrito = [{ id: 6, nombre: 'Cable', precio: 99.99, stock: 40, imagen: '', cantidad: 10 }]
  const sincronizar = (items, productos) =>
    cartReducer(items, { type: 'SINCRONIZAR', productos })

  it('quita productos que ya no existen en el catálogo', () => {
    expect(sincronizar(enCarrito, [])).toEqual([])
  })

  it('quita productos que se agotaron', () => {
    expect(sincronizar(enCarrito, [{ ...enCarrito[0], stock: 0 }])).toEqual([])
  })

  it('ajusta la cantidad al nuevo stock', () => {
    const r = sincronizar(enCarrito, [{ ...enCarrito[0], stock: 4 }])
    expect(r[0].cantidad).toBe(4)
    expect(r[0].stock).toBe(4)
  })

  it('actualiza el precio con el del catálogo', () => {
    const r = sincronizar(enCarrito, [{ ...enCarrito[0], precio: 120 }])
    expect(r[0].precio).toBe(120)
  })

  it('descarta cantidades corruptas', () => {
    const malos = [
      { ...enCarrito[0], cantidad: -3 },
      { ...enCarrito[0], id: 7, cantidad: 1.5 },
      { ...enCarrito[0], id: 8, cantidad: 'abc' },
    ]
    const productos = [6, 7, 8].map((id) => ({ ...enCarrito[0], id }))
    expect(sincronizar(malos, productos)).toEqual([])
  })
})