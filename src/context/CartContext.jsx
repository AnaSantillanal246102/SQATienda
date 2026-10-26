// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

export const CartContext = createContext(null)

const CLAVE = 'carrito'

function leerGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE))
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerGuardado)

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(items))
  }, [items])

  // producto = objeto completo que viene de la API
  const agregar = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === producto.id)
      if (existente) {
        return prev.map((i) =>
          i.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, i.stock ?? Infinity) }
            : i
        )
      }
      return [...prev, { ...producto, cantidad: Math.min(cantidad, producto.stock ?? Infinity) }]
    })
  }

  // cantidad = nueva cantidad total del producto
  const cambiar = (id, cantidad) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock ?? Infinity)) }
          : i
      )
    )
  }

  const quitar = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const vaciar = () => setItems([])

  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, agregar, cambiar, quitar, vaciar, cantidadTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider')
  return context
}