import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from './Hero'
import { NOMBRE_TIENDA } from '../config'

describe('Hero', () => {
  it('muestra el título principal como único h1', () => {
    render(<Hero />)
    const titulos = screen.getAllByRole('heading', { level: 1 })
    expect(titulos).toHaveLength(1)
    expect(titulos[0]).toHaveTextContent('Está aquí.')
  })

  it('el botón lleva a la sección del catálogo', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /explorar catálogo/i })).toHaveAttribute('href', '#catalogo')
  })

  it('usa el nombre de la tienda configurado', () => {
    render(<Hero />)
    expect(screen.getByText(`${NOMBRE_TIENDA.toUpperCase()} / 01`)).toBeInTheDocument()
  })
})