
/**
 * @file PaymentPage.jsx
 * @description Página de pago de demostración que verifica el inventario
 * y permite al usuario finalizar el proceso sin realizar ningún cobro.
 *
 * @author Ana Santillan
 * @version 1.0
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Ban, ShieldCheck } from 'lucide-react'

import { useCart } from '../context/CartContext'
import StepIndicator from '../components/StepIndicator'
import { calcularTotales, validarCarrito } from '../utils/cart'
import { formatearMoneda } from '../utils/format'
import { obtenerProductos } from '../services/productService'

/**
 * Página de pago de la tienda.
 *
 * Calcula el importe total de la compra, consulta los productos
 * disponibles en el backend y verifica que las cantidades solicitadas
 * sean compatibles con las existencias actuales.
 *
 * El módulo de pago es únicamente demostrativo: no procesa transacciones
 * ni realiza cobros reales. Si la validación es satisfactoria, permite
 * al usuario finalizar la demostración.

 * @returns {JSX.Element} Interfaz de pago con resumen del importe,
 * validaciones de inventario y opciones de navegación.
 * @see useCart
 * @see StepIndicator
 * @see calcularTotales
 * @see validarCarrito
 * @see formatearMoneda
 * @see obtenerProductos
 */
export default function PaymentPage() {
  const { items } = useCart()
  const navigate = useNavigate()

  /**
   * Indica si se intentó realizar el pago y la validación del
   * inventario fue satisfactoria.
   *
   * @type {[boolean, Function]}
   */
  const [intento, setIntento] = useState(false)

  /**
   * Lista de problemas detectados al validar los productos del carrito.
   *
   * @type {[Array<string>, Function]}
   */
  const [problemas, setProblemas] = useState([])

  /**
   * Indica si la consulta y validación del inventario están en curso.
   *
   * @type {[boolean, Function]}
   */
  const [validando, setValidando] = useState(false)

  /**
   * Mensaje de error producido al consultar o validar el inventario.
   *
   * @type {[string, Function]}
   */
  const [error, setError] = useState('')

  /**
   * Totales calculados a partir de los productos del carrito.
   *
   * @type {{subtotal: number, iva: number, total: number}}
   * @see calcularTotales
   */
  const { subtotal, iva, total } = calcularTotales(items)

  /**
   * Gestiona el intento de pago mediante la validación del inventario.
   *
   * Consulta los productos del backend, comprueba que la respuesta
   * sea un arreglo y valida las cantidades del carrito.
   *
   * Si no existen problemas, habilita el mensaje de demostración.
   * Si ocurre un error durante la consulta, muestra un mensaje
   * informativo. Finalmente, desactiva el indicador de validación.
   *
   * @async
   * @param {Event} e - Evento de envío del formulario de pago.
   * @returns {Promise<void>} Promesa que finaliza al completar la validación.
   * @throws {Error} Si la API no devuelve una lista válida de productos.
   * @see obtenerProductos
   * @see validarCarrito
   */
  async function manejarPago(e) {
    e.preventDefault()

    setIntento(false)
    setProblemas([])
    setError('')
    setValidando(true)

    try {
      // Obtener los productos reales del backend
      const productos = await obtenerProductos()

      // Validar que la respuesta sea un arreglo
      if (!Array.isArray(productos)) {
        throw new Error(
          'La API no devolvió una lista válida de productos.'
        )
      }

      // Comprobar existencias y cantidades
      const encontrados = validarCarrito(items, productos)

      setProblemas(encontrados)

      // El pago continúa siendo una demostración
      if (encontrados.length === 0) {
        setIntento(true)
      }
    } catch (err) {
      console.error('Error al validar el carrito:', err)

      setError(
        'No se pudo verificar el inventario. Inténtalo de nuevo más tarde.'
      )
    } finally {
      setValidando(false)
    }
  }

  return (
    <section className="narrow">
      <StepIndicator actual={4} />
      <h1>Pago</h1>

      <div className="amount">
        <p className="muted">Importe a pagar</p>
        <p className="amount__value">
          {formatearMoneda(total)}
        </p>
        <p className="muted small">
          Subtotal {formatearMoneda(subtotal)} + IVA{' '}
          {formatearMoneda(iva)}
        </p>
      </div>

      <form
        onSubmit={manejarPago}
        noValidate
        autoComplete="off"
        className="form"
      >
        {error && (
          <div className="alert alert--danger" role="alert">
            <p>{error}</p>
          </div>
        )}

        {problemas.length > 0 && (
          <div className="alert alert--danger" role="alert">
            <div>
              <strong>Revisa tu carrito antes de pagar:</strong>
              <ul>
                {problemas.map((mensaje, indice) => (
                  <li key={`${mensaje}-${indice}`}>{mensaje}</li>
                ))}
              </ul>
              <Link to="/carrito">Ir al carrito</Link>
            </div>
          </div>
        )}

        {intento && (
          <div className="alert alert--warning" role="alert">
            <span className="alert__icon">
              <Ban size={24} aria-hidden="true" />
            </span>

            <div>
              <strong>
                El servicio de pago todavía no se encuentra disponible.
              </strong>
              <p>No se ha realizado ningún cobro.</p>

              <button
                type="button"
                className="link-btn"
                onClick={() => navigate('/finalizado')}
              >
                Finalizar demostración
              </button>
            </div>
          </div>
        )}

        <p className="secure">
          <ShieldCheck size={16} aria-hidden="true" />
          El módulo de pago no se encuentra activo.
        </p>

        <div className="actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => navigate('/carrito')}
          >
            Volver al carrito
          </button>

          <div className="actions__group">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => navigate('/resumen')}
            >
              Volver al resumen
            </button>

            <button
              type="submit"
              className="btn"
              disabled={validando}
            >
              {validando
                ? 'Verificando inventario...'
                : `Pagar ${formatearMoneda(total)}`}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
