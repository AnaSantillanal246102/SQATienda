import { createContext, useContext, useEffect, useReducer } from 'react'
import { cartReducer } from '../utils/cartReducer'
import { obtenerProductos } from '../services/productService'

const CartContext = createContext(null)
const CLAVE = 'tienda-carrito'

function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    const datos = guardado ? JSON.parse(guardado) : []
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], cargarCarrito)

  useEffect(() => {
    dispatch({ type: 'SINCRONIZAR', productos: obtenerProductos() })
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items))
    } catch {
      // si el almacenamiento falla, la app sigue funcionando
    }
  }, [items])

  const value = {
    items,
    cantidadTotal: items.reduce((suma, i) => suma + i.cantidad, 0),
    agregar: (producto, cantidad) => dispatch({ type: 'AGREGAR', producto, cantidad }),
    cambiar: (id, cantidad) => dispatch({ type: 'CAMBIAR', id, cantidad }),
    quitar: (id) => dispatch({ type: 'QUITAR', id }),
    vaciar: () => dispatch({ type: 'VACIAR' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}