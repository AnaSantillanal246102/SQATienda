import { createContext, useContext, useState } from 'react'

const CheckoutContext = createContext(null)
const CLAVE = 'tienda-cliente'

function cargar() {
  try {
    const g = sessionStorage.getItem(CLAVE)
    return g ? JSON.parse(g) : null
  } catch {
    return null
  }
}

export function CheckoutProvider({ children }) {
  const [cliente, setCliente] = useState(cargar)

  function guardarCliente(datos) {
    setCliente(datos)
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(datos))
    } catch {
      // si falla, la app sigue funcionando con el estado en memoria
    }
  }

  return (
    <CheckoutContext.Provider value={{ cliente, guardarCliente }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout debe usarse dentro de CheckoutProvider')
  return ctx
}