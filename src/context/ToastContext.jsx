import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [mensaje, setMensaje] = useState('')
  const temporizador = useRef(null)

  const mostrar = useCallback((texto) => {
    setMensaje(texto)
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setMensaje(''), 2800)
  }, [])

  useEffect(() => () => clearTimeout(temporizador.current), [])

  return (
    <ToastContext.Provider value={mostrar}>
      {children}
      <div className={`toast${mensaje ? ' toast--show' : ''}`} role="status" aria-live="polite">
        {mensaje}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)