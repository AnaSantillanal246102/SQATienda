import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCheckout } from '../context/CheckoutContext'
import { validarCampo, validarCliente } from '../utils/validators'
import FormField from '../components/FormField'
import StepIndicator from '../components/StepIndicator'

const VACIO = { nombre: '', email: '', telefono: '', direccion: '', ciudad: '', cp: '' }

export default function CheckoutPage() {
  const { items } = useCart()
  const { cliente, guardarCliente } = useCheckout()
  const navigate = useNavigate()
  const [datos, setDatos] = useState(cliente ?? VACIO)
  const [errores, setErrores] = useState({})

  // Acción que no tiene sentido: llegar a "datos" sin productos
  if (items.length === 0) return <Navigate to="/carrito" replace />

  function manejarCambio(e) {
    const { name, value } = e.target
    setDatos((d) => ({ ...d, [name]: value }))
    if (errores[name]) setErrores((er) => ({ ...er, [name]: null }))
  }

  function manejarBlur(e) {
    const { name, value } = e.target
    setErrores((er) => ({ ...er, [name]: validarCampo(name, value) }))
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const nuevos = validarCliente(datos)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      const primero = Object.keys(nuevos)[0]
      document.getElementById(primero)?.focus()
      return
    }
    guardarCliente({
      ...datos,
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      direccion: datos.direccion.trim(),
      ciudad: datos.ciudad.trim(),
    })
    navigate('/resumen')
  }

  const comunes = { onChange: manejarCambio, onBlur: manejarBlur }

  return (
    <section>
      <StepIndicator actual={2} />
      <h1>Datos de entrega</h1>
      <p className="muted">Todos los campos son obligatorios.</p>
      <form onSubmit={manejarEnvio} noValidate className="form">
        <FormField id="nombre" label="Nombre completo" autoComplete="name" value={datos.nombre} error={errores.nombre} {...comunes} />
        <FormField id="email" label="Correo electrónico" type="email" autoComplete="email" value={datos.email} error={errores.email} {...comunes} />
        <FormField id="telefono" label="Teléfono (10 dígitos)" type="tel" inputMode="numeric" autoComplete="tel" value={datos.telefono} error={errores.telefono} {...comunes} />
        <FormField id="direccion" label="Calle y número" autoComplete="street-address" value={datos.direccion} error={errores.direccion} {...comunes} />
        <FormField id="ciudad" label="Ciudad" autoComplete="address-level2" value={datos.ciudad} error={errores.ciudad} {...comunes} />
        <FormField id="cp" label="Código postal" inputMode="numeric" maxLength={5} autoComplete="postal-code" value={datos.cp} error={errores.cp} {...comunes} />
        <div className="actions">
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/carrito')}>Volver al carrito</button>
          <button type="submit" className="btn">Revisar mi compra</button>
        </div>
      </form>
    </section>
  )
}