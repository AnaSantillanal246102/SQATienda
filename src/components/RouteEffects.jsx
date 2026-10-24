import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const TITULOS = {
  '/': 'Catálogo',
  '/carrito': 'Carrito',
  '/datos': 'Datos de entrega',
  '/resumen': 'Resumen de compra',
  '/pago': 'Pago',
}

export default function RouteEffects() {
  const { pathname } = useLocation()
  const primera = useRef(true)

  useEffect(() => {
    const titulo =
      TITULOS[pathname] ??
      (pathname.startsWith('/producto/') ? 'Detalle de producto' : 'Página no encontrada')
    document.title = `${titulo} · Mi Tienda`

    // En la carga inicial no movemos el foco
    if (primera.current) {
      primera.current = false
      return
    }
    window.scrollTo(0, 0)
    document.getElementById('contenido')?.focus()
  }, [pathname])

  return null
}