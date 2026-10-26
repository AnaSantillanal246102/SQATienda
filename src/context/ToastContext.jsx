
/**
 * @file ToastContext.jsx
 * @description Contexto global para mostrar notificaciones temporales
 * en la interfaz de usuario.
 *
 * @author Ana Santillan
 * @version 1.0
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

/**
 * Contexto de React que proporciona una función para mostrar
 * notificaciones temporales a los componentes de la aplicación.
 * @see ToastProvider
 * @see useToast
 */
const ToastContext = createContext(() => {})

/**
 * Proveedor que administra las notificaciones temporales de la aplicación.
 * Muestra un mensaje durante 2800 milisegundos y después lo oculta.
 * También limpia el temporizador cuando el componente se desmonta.
 * @param {Object} props - Propiedades del componente.
 * @param {import('react').ReactNode} props.children - Componentes que tendrán acceso al contexto.
 * @returns {JSX.Element} Proveedor con la función para mostrar notificaciones
 * y el contenedor visual del mensaje.
 * @see ToastContext
 * @see useToast
 */
export function ToastProvider({ children }) {
  const [mensaje, setMensaje] = useState('')
  const temporizador = useRef(null)

  /**
   * Muestra una notificación con el texto indicado.
   * Cancela el temporizador anterior y programa el ocultamiento
   * del mensaje después de 2800 milisegundos.
   *
   * @param {string} texto - Mensaje que se mostrará en la notificación.
   * @returns {void} No devuelve ningún valor.
   */
  const mostrar = useCallback((texto) => {
    setMensaje(texto)
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setMensaje(''), 2800)
  }, [])

  /**
   * Limpia el temporizador cuando el proveedor se desmonta
   * para evitar que quede una tarea pendiente.
   *
   * @returns {Function} Función de limpieza del efecto.
   */
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

/**
 * Hook personalizado que permite acceder a la función para mostrar
 * notificaciones temporales desde cualquier componente descendiente
 * de ToastProvider.
 *
 * @returns {Function} Función que recibe un texto y muestra una notificación.
 * @see ToastContext
 * @see ToastProvider
 */
export const useToast = () => useContext(ToastContext)
