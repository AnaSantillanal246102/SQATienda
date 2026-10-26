import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CheckoutProvider } from './context/CheckoutContext'
import App from './App'
import './index.css'
import '@fontsource-variable/inter'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <CheckoutProvider>
          <App />
        </CheckoutProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
)