
/**
 * @file CartContext.jsx
 * @description Contexto global para administrar el carrito de compras,
 * almacenar sus productos en localStorage y mantener sus cantidades.
 *
 * @author Ana Santillan
 * @version 1.0
 */

import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Contexto de React que permite compartir el estado y las operaciones
 * del carrito de compras entre los componentes de la aplicación.
 * @see CartProvider
 * @see useCart
 */
export const CartContext = createContext(null)

/**
 * Clave utilizada para guardar y recuperar el carrito desde localStorage.
 */
const CLAVE = 'carrito'

/**
 * Recupera los productos del carrito almacenados en localStorage.
 * Si los datos no existen, no tienen el formato esperado o no se pueden
 * interpretar, devuelve un arreglo vacío.
 *
 * @returns {Array} Lista de productos guardados en el carrito.
 * @see CLAVE
 */
function leerGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE))
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

/**
 * Proveedor que administra el estado global del carrito de compras.
 * Inicializa los productos desde localStorage y sincroniza los cambios
 * del carrito con el almacenamiento local.
 *
 * Permite agregar productos, cambiar cantidades, quitar productos,
 * vaciar el carrito y consultar la cantidad total de unidades.

 * @param {Object} props - Propiedades del componente.
 * @param {import('react').ReactNode} props.children - Componentes que tendrán acceso al contexto.
 * @returns {JSX.Element} Proveedor con el estado y las funciones del carrito.
 * @see CartContext
 * @see useCart
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(leerGuardado)

  /**
   * Guarda el estado actual del carrito en localStorage
   * cada vez que cambia la lista de productos.
   *
   * @returns {void} No devuelve ningún valor.
   */
  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(items))
  }, [items])

  /**
   * Agrega un producto al carrito o incrementa su cantidad
   * si ya se encuentra agregado, respetando el límite de stock.
   *
   * @param {Object} producto - Objeto completo del producto recibido de la API.
   * @param {number} producto.id - Identificador único del producto.
   * @param {number} [producto.stock] - Unidades disponibles del producto.
   * @param {number} [cantidad=1] - Número de unidades que se desean agregar.
   * @returns {void} No devuelve ningún valor.
   */
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

  /**
   * Actualiza la cantidad total de un producto del carrito.
   * La cantidad se mantiene entre 1 y el stock disponible.
   *
   * @param {number|string} id - Identificador del producto que se actualizará.
   * @param {number} cantidad - Nueva cantidad total deseada del producto.
   * @returns {void} No devuelve ningún valor.
   */
  const cambiar = (id, cantidad) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock ?? Infinity)) }
          : i
      )
    )
  }

  /**
   * Elimina del carrito el producto cuyo identificador coincide con el indicado.
   *
   * @param {number|string} id - Identificador del producto que se eliminará.
   * @returns {void} No devuelve ningún valor.
   */
  const quitar = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  /**
   * Elimina todos los productos del carrito.
   *
   * @returns {void} No devuelve ningún valor.
   */
  const vaciar = () => setItems([])

  /**
   * Calcula la suma de las unidades de todos los productos del carrito.
   *
   * @type {number}
   */
  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, agregar, cambiar, quitar, vaciar, cantidadTotal }}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * Hook personalizado que permite acceder al contexto del carrito.
 * Comprueba que se utilice dentro de un CartProvider para evitar
 * acceder a un contexto que no esté disponible.
 *
 * @returns {{items: Array, agregar: Function, cambiar: Function, quitar: Function, vaciar: Function, cantidadTotal: number}}
 * Estado del carrito y funciones para administrar sus productos.
 * @throws {Error} Si se utiliza fuera de un CartProvider.
 * @see CartContext
 * @see CartProvider
 */
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider')
  return context
}
