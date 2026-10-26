// src/services/inventarioService.js

const API_URL = 'http://localhost:3001/api/inventario';

export async function obtenerInventario() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener el inventario');
  return response.json();
}

export async function obtenerMovimientos(productoId) {
  const response = await fetch(`${API_URL}/${productoId}/movimientos`);
  if (!response.ok) throw new Error('Error al obtener el historial');
  return response.json();
}

// Lanza un Error con el mensaje que devuelve el backend (ej. "Stock insuficiente")
export async function registrarMovimiento(datos) {
  const response = await fetch(`${API_URL}/movimientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  const cuerpo = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detalle = cuerpo.stock !== undefined ? ` (hay ${cuerpo.stock})` : '';
    throw new Error((cuerpo.error || 'Error al registrar el movimiento') + detalle);
  }
  return cuerpo;
}