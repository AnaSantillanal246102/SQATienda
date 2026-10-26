
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CheckoutProvider } from './context/CheckoutContext'
import { ToastProvider } from './context/ToastContext'
import App from './App'
import './index.css'
import '@fontsource-variable/inter'

/**
 * Punto de entrada principal de la aplicación Mora Store.
 *
 * Inicializa React y configura los proveedores de contexto,
 * el sistema de navegación y los estilos globales.
 *
 * @author Ana Santillan
 * @author Jared Beltran
 * @author Jared Martinez
 * @author Jonathan Trejo
 * @version 1.0
 * @since 10/25/2028
 * @see App.jsx
 * @see /context/CartContext.jsx
 * @see /context/CheckoutContext.jsx
 * @see /context/ToastContext.jsx
 */
createRoot(document.getElementById('root')).render(
  // Activa comprobaciones adicionales durante el desarrollo
  <StrictMode>

    {/* Habilita la navegación mediante rutas en la aplicación */}
    <BrowserRouter>

      {/* Proporciona el estado global del carrito de compras */}
      <CartProvider>

        {/* Proporciona el estado global del proceso de compra */}
        <CheckoutProvider>

          {/* Permite mostrar notificaciones emergentes */}
          <ToastProvider>

            {/* Renderiza el componente principal de la aplicación */}
            <App />

          </ToastProvider>
        </CheckoutProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
)
