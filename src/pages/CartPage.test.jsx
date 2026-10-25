import { describe, it, expect, beforeEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import CartPage from './CartPage'

import { obtenerProductoPorId } from '../services/productService'

const P = obtenerProductoPorId(1)
const ITEM = { id: P.id, nombre: P.nombre, precio: P.precio, stock: P.stock, imagen: P.imagen, cantidad: 2 }

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
    expect(screen.getByText(P.nombre)).toBeInTheDocument()
  })

  it('cancelar conserva los productos', () => {
    renderizar()
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.getByText(P.nombre)).toBeInTheDocument()
  })

  it('confirmar vacía el carrito y muestra el estado vacío', () => {
    renderizar()
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }))
    screen.debug()
    fireEvent.click(screen.getByRole('button', { name: 'Sí, vaciar' }))
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })
})