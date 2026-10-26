
/**
 * @file CheckoutContext.jsx
 * @description Contexto global para administrar los datos del cliente
 * durante el proceso de compra y conservarlos en sessionStorage.
 *
 * @author Ana Santillan
 * @version 1.0
 */

import { createContext, useContext, useState } from 'react'

/**
 * Contexto de React que permite compartir los datos del cliente
 * entre los componentes del proceso de compra.
 * @see CheckoutProvider
 * @see useCheckout
 */
const CheckoutContext = createContext(null)

/**
 * Clave utilizada para almacenar los datos del cliente
 * en sessionStorage durante la sesión de navegación.

 */
const CLAVE = 'tienda-cliente'

/**
 * Recupera los datos del cliente almacenados en sessionStorage.
 * Si no existen datos o ocurre un error al leerlos o interpretarlos,
 * devuelve null.
 *
 * @returns {Object|null} Datos guardados del cliente o null si no existen.
 * @see CLAVE
 */
function cargar() {
  try {
    const g = sessionStorage.getItem(CLAVE)
    return g ? JSON.parse(g) : null
  } catch {
    return null
  }
}

/**
 * Proveedor que administra los datos del cliente durante el proceso
 * de compra. Inicializa el estado con los datos guardados y permite
 * actualizarlos y almacenarlos en sessionStorage.
 * @param {Object} props - Propiedades del componente.
 * @param {import('react').ReactNode} props.children - Componentes que tendrán acceso al contexto.
 * @returns {JSX.Element} Proveedor con los datos y funciones del cliente.
 * @see CheckoutContext
 * @see useCheckout
 */
export function CheckoutProvider({ children }) {
  const [cliente, setCliente] = useState(cargar)

  /**
   * Actualiza los datos del cliente en el estado de React
   * e intenta guardarlos en sessionStorage.
   * Si el almacenamiento falla, los datos permanecen disponibles
   * en el estado de la aplicación mientras siga montado el proveedor.
   *
   * @param {Object} datos - Objeto con la información del cliente.
   * @returns {void} No devuelve ningún valor.
   */
  function guardarCliente(datos) {
    setCliente(datos)
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(datos))
    } catch {
      // Si falla, la app sigue funcionando con el estado en memoria.
    }
  }

  return (
    <CheckoutContext.Provider value={{ cliente, guardarCliente }}>
      {children}
    </CheckoutContext.Provider>
  )
}

/**
 * Hook personalizado que permite acceder a los datos del cliente
 * y a la función para actualizarlos.
 *
 * @returns {{cliente: Object|null, guardarCliente: Function}}
 * Objeto con los datos del cliente y la función para guardarlos.
 * @throws {Error} Si se utiliza fuera de un CheckoutProvider.
 * @see CheckoutContext
 * @see CheckoutProvider
 */
export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout debe usarse dentro de CheckoutProvider')
  return ctx
}
