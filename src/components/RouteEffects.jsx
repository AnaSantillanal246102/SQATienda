
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Mapa de rutas y títulos que se muestran en la pestaña del navegador.
 *
 * @author Ana Santillan
 * @version 1.0
 * @see RouteEffects
 */
const TITULOS = {
  '/': 'Catálogo',
  '/carrito': 'Carrito',
  '/datos': 'Datos de entrega',
  '/resumen': 'Resumen de compra',
  '/pago': 'Pago',
}

/**
 * Componente que gestiona los efectos secundarios al cambiar de ruta.
 * Actualiza el título de la pestaña del navegador, desplaza la página
 * al inicio y mueve el foco al contenido principal cuando corresponde.
 * En la carga inicial evita mover el foco y respeta la interacción
 * con los elementos de búsqueda.
 *
 * @returns {null} No renderiza elementos en la interfaz.
 * @see useLocation
 * @see useEffect
 * @see useRef
 */
export default function RouteEffects() {
  const { pathname } = useLocation()
  const primera = useRef(true)

  /**
   * Actualiza el título del documento y gestiona el desplazamiento
   * y el foco de accesibilidad cuando cambia la ruta actual.
   *
   * @returns {void} No devuelve ningún valor.
   */
  useEffect(() => {
    const titulo =
      TITULOS[pathname] ??
      (pathname.startsWith('/producto/') ? 'Detalle de producto' : 'Página no encontrada')
    document.title = `${titulo} · ByteShop`

    // En la carga inicial no movemos el foco
    if (primera.current) {
      primera.current = false
      return
    }
    if (document.activeElement?.closest?.('[role="search"]')) return
    window.scrollTo(0, 0)
    document.getElementById('contenido')?.focus()
  }, [pathname])

  return null
}
