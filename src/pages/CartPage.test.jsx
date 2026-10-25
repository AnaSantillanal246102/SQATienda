import { describe, it, expect, beforeEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import CartPage from './CartPage'

const ITEM = { id: 6, nombre: 'Cable HDMI 2 metros', precio: 99.99, stock: 40, imagen: '', cantidad: 2 }

function renderizar() {
  localStorage.setItem('tienda-carrito', JSON.stringify([ITEM]))
  return render(
    <MemoryRouter>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </MemoryRouter>
  )
}

describe('Carrito · vaciar con confirmación', () => {
  beforeEach(() => localStorage.clear())

  it('pide confirmación y no borra todavía', () => {
    renderizar()
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }))
    expect(screen.getByText('¿Vaciar todo el carrito?')).toBeInTheDocument()
    expect(screen.getByText('Cable HDMI 2 metros')).toBeInTheDocument()
  })

  it('cancelar conserva los productos', () => {
    renderizar()
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.getByText('Cable HDMI 2 metros')).toBeInTheDocument()
  })

  it('confirmar vacía el carrito y muestra el estado vacío', () => {
    renderizar()
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }))
    screen.debug()
    fireEvent.click(screen.getByRole('button', { name: 'Sí, vaciar' }))
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })
})