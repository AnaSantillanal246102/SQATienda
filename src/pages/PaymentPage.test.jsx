import { describe, it, expect, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import { CheckoutProvider } from '../context/CheckoutContext'
import CheckoutGuard from '../components/CheckoutGuard'
import PaymentPage from './PaymentPage'

import { obtenerProductoPorId } from '../services/productService'

const P = obtenerProductoPorId(1)
const ITEM = { id: P.id, nombre: P.nombre, precio: P.precio, stock: P.stock, imagen: P.imagen, cantidad: 2 }

const CLIENTE = {
  nombre: 'Ana López',
  email: 'ana@correo.com',
  telefono: '6561234567',
  direccion: 'Av. Juárez 123',
  ciudad: 'Ciudad Juárez',
  cp: '32000',
  estado: 'Chihuahua',
}

function renderizar() {
  return render(
    <MemoryRouter initialEntries={['/pago']}>
      <CartProvider>
        <CheckoutProvider>
          <Routes>
            <Route path="/pago" element={<CheckoutGuard><PaymentPage /></CheckoutGuard>} />
            <Route path="/carrito" element={<h1>PANTALLA CARRITO</h1>} />
            <Route path="/datos" element={<h1>PANTALLA DATOS</h1>} />
          </Routes>
        </CheckoutProvider>
      </CartProvider>
    </MemoryRouter>
  )
}

describe('Pantalla de pago', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('redirige al carrito si está vacío', () => {
    sessionStorage.setItem('tienda-cliente', JSON.stringify(CLIENTE))
    renderizar()
    expect(screen.getByText('PANTALLA CARRITO')).toBeInTheDocument()
  })

  it('redirige a datos si faltan los datos del cliente', () => {
    localStorage.setItem('tienda-carrito', JSON.stringify([ITEM]))
    renderizar()
    expect(screen.getByText('PANTALLA DATOS')).toBeInTheDocument()
  })

  it('redirige a datos si los datos guardados son inválidos', () => {
    localStorage.setItem('tienda-carrito', JSON.stringify([ITEM]))
    sessionStorage.setItem('tienda-cliente', JSON.stringify({ ...CLIENTE, cp: '1' }))
    renderizar()
    expect(screen.getAllByText('PANTALLA DATOS').length).toBeGreaterThan(0)
  })

  it('al intentar pagar muestra que la función no está disponible', () => {
    localStorage.setItem('tienda-carrito', JSON.stringify([ITEM]))
    sessionStorage.setItem('tienda-cliente', JSON.stringify(CLIENTE))
    renderizar()

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^pagar/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/todavía no se encuentra disponible/i)
  })
})