
/**
 * @file InventarioPage.jsx
 * @description Página para consultar las existencias de productos,
 * filtrar el inventario, registrar movimientos y consultar historiales.
 *
 * @author Jared Martinez
 * @version 1.0
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import {
  obtenerInventario,
  obtenerMovimientos,
  registrarMovimiento,
} from '../services/inventarioService'
import {
  estadoStock,
  stockResultante,
  variacion,
  formatearVariacion,
} from '../utils/inventario'
import EmptyState from '../components/EmptyState'

/**
 * Normaliza un texto para realizar búsquedas sin distinguir
 * entre mayúsculas, minúsculas ni caracteres acentuados.
 * @param {string} t - Texto que se desea normalizar.
 * @returns {string} Texto en minúsculas y sin acentos.
 */
const normalizar = (t) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/**
 * Valores iniciales del formulario para registrar movimientos
 * de inventario.
 * @see InventarioPage
 */
const FORM_INICIAL = {
  producto_id: '',
  tipo: 'entrada',
  cantidad: '',
  motivo: '',
  usuario: '',
}

/**
 * Etiquetas legibles correspondientes a los tipos de movimiento.
 * @see InventarioPage
 */
const ETIQUETA_TIPO = {
  entrada: 'Entrada',
  salida: 'Salida',
  ajuste: 'Ajuste',
}

/**
 * Convierte una fecha en formato ISO a una cadena localizada
 * con fecha y hora para mostrarla en el historial.
 *
 * @param {string} iso - Fecha y hora en formato ISO.
 * @returns {string} Fecha y hora formateadas según la configuración es-MX.
 */
const formatearFecha = (iso) =>
  new Date(iso).toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

/**
 * Página de administración del inventario.
 *
 * Permite consultar existencias, buscar productos, filtrar por categoría
 * y detectar niveles de stock bajos. También permite registrar entradas,
 * salidas y ajustes, calcular el stock resultante y consultar el historial
 * de movimientos de cada producto.
 *
 * Gestiona los estados de carga, errores y confirmación de operaciones,
 * además de facilitar el acceso al formulario de movimientos.

 * @returns {JSX.Element} Interfaz de administración del inventario.
 * @see obtenerInventario
 * @see obtenerMovimientos
 * @see registrarMovimiento
 * @see estadoStock
 * @see stockResultante
 * @see variacion
 * @see formatearVariacion
 * @see EmptyState
 */
export default function InventarioPage() {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [soloBajo, setSoloBajo] = useState(false)

  const [form, setForm] = useState(FORM_INICIAL)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const [historialId, setHistorialId] = useState(null)
  const [historial, setHistorial] = useState({ id: null, filas: [] })

  const formRef = useRef(null)
  const cantidadRef = useRef(null)

  /**
   * Obtiene el inventario desde el servicio correspondiente.
   * Actualiza la lista de productos y el estado de error.
   * La variable activo evita actualizar el estado después
   * de que el efecto se haya limpiado.
   *
   * @returns {void} No devuelve ningún valor directamente.
   * @see obtenerInventario
   */
  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        const data = await obtenerInventario()
        if (!activo) return
        setItems(data)
        setError(null)
      } catch (err) {
        console.error(err)
        if (activo) {
          setError(
            'No se pudo cargar el inventario. Verifica que el backend esté corriendo.'
          )
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargar()

    return () => {
      activo = false
    }
  }, [version])

  /**
   * Obtiene el historial de movimientos del producto seleccionado.
   * Si ocurre un error, establece el historial como no disponible.
   * Evita actualizar el estado cuando el efecto deja de estar activo.
   *
   * @returns {void} No devuelve ningún valor directamente.
   * @see obtenerMovimientos
   */
  useEffect(() => {
    if (historialId === null) return

    let activo = true

    obtenerMovimientos(historialId)
      .then((filas) => {
        if (activo) setHistorial({ id: historialId, filas })
      })
      .catch((err) => {
        console.error(err)
        if (activo) setHistorial({ id: historialId, filas: null })
      })

    return () => {
      activo = false
    }
  }, [historialId, version])

  /**
   * Obtiene las categorías únicas de los productos del inventario
   * y las ordena alfabéticamente según la configuración es.
   *
   * @type {Array<string>}
   */
  const categorias = useMemo(
    () =>
      [...new Set(items.map((p) => p.categoria))].sort(
        (a, b) => a.localeCompare(b, 'es')
      ),
    [items]
  )

  /**
   * Cuenta los productos cuyo stock requiere atención.
   *
   * @type {number}
   * @see estadoStock
   */
  const totalBajos = useMemo(
    () => items.filter((p) => estadoStock(p).clase !== 'ok').length,
    [items]
  )

  /**
   * Filtra los productos por categoría, nivel de stock y texto.
   *
   * @type {Array}
   * @see normalizar
   * @see estadoStock
   */
  const lista = useMemo(() => {
    const t = normalizar(busqueda.trim())

    return items.filter(
      (p) =>
        (!categoria || p.categoria === categoria) &&
        (!soloBajo || estadoStock(p).clase !== 'ok') &&
        (!t || normalizar(`${p.nombre} ${p.categoria}`).includes(t))
    )
  }, [items, busqueda, categoria, soloBajo])

  // Estado derivado del formulario

  /**
   * Producto seleccionado en el formulario de movimientos.
   *
   * @type {Object|undefined}
   */
  const productoForm = items.find(
    (p) => String(p.id) === form.producto_id
  )

  /**
   * Cantidad introducida en el formulario, convertida a número.
   * Si el campo está vacío, su valor es NaN.
   *
   * @type {number}
   */
  const cantidad = form.cantidad === '' ? NaN : Number(form.cantidad)

  /**
   * Cantidad mínima permitida para el movimiento.
   * Los ajustes aceptan cero; las entradas y salidas requieren al menos uno.
   *
   * @type {number}
   */
  const minimo = form.tipo === 'ajuste' ? 0 : 1

  /**
   * Indica si la cantidad introducida es un entero válido
   * y cumple con la cantidad mínima permitida.
   *
   * @type {boolean}
   */
  const cantidadValida =
    Number.isInteger(cantidad) && cantidad >= minimo

  /**
   * Calcula el stock que resultaría después de registrar el movimiento,
   * siempre que exista un producto seleccionado y la cantidad sea válida.
   *
   * @type {number|null}
   * @see stockResultante
   */
  const resultado =
    productoForm && cantidadValida
      ? stockResultante(productoForm.stock, form.tipo, cantidad)
      : null

  /**
   * Indica si el movimiento produciría un stock negativo.
   *
   * @type {boolean}
   */
  const sinStock = resultado !== null && resultado < 0

  /**
   * Indica si el movimiento dejaría el stock sin cambios.
   *
   * @type {boolean}
   */
  const sinCambio =
    resultado !== null && resultado === productoForm.stock

  /**
   * Determina si el formulario puede enviarse.
   * Requiere un producto seleccionado, una cantidad válida,
   * stock suficiente y un cambio real en las existencias.
   *
   * @type {boolean}
   */
  const puedeEnviar =
    Boolean(productoForm) &&
    cantidadValida &&
    !sinStock &&
    !sinCambio &&
    !enviando

  /**
   * Mensaje informativo sobre el resultado del movimiento.
   *
   * @type {string}
   */
  let avisoStock = ''

  if (resultado !== null) {
    if (sinStock) {
      avisoStock = `Stock insuficiente: hay ${productoForm.stock}.`
    } else if (sinCambio) {
      avisoStock = 'El conteo coincide con el stock actual.'
    } else {
      avisoStock = `Stock después del movimiento: ${resultado}`
    }
  }

  /**
   * Crea un manejador para actualizar un campo específico
   * del formulario de movimientos.
   *
   * @param {string} campo - Nombre del campo que se actualizará.
   * @returns {Function} Función que recibe el evento de cambio del campo.
   */
  const cambiar = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }))

  /**
   * Prepara el formulario para registrar un movimiento del producto
   * seleccionado, limpia los mensajes anteriores y desplaza la vista
   * hacia el formulario, enfocando el campo de cantidad.
   *
   * @param {Object} p - Producto para el que se registrará el movimiento.
   * @param {number|string} p.id - Identificador del producto.
   * @returns {void} No devuelve ningún valor.
   */
  function prepararMovimiento(p) {
    setForm((f) => ({ ...f, producto_id: String(p.id) }))
    setMensaje(null)
    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    cantidadRef.current?.focus({ preventScroll: true })
  }

  /**
   * Valida y registra un movimiento de inventario.
   * Si el formulario es válido, envía los datos al servicio,
   * muestra el resultado, actualiza el historial y solicita
   * una nueva carga del inventario.
   *
   * @param {Event} e - Evento de envío del formulario.
   * @returns {Promise<void>} Promesa que finaliza cuando termina el registro.
   * @see registrarMovimiento
   */
  async function enviar(e) {
    e.preventDefault()
    if (!puedeEnviar) return

    setEnviando(true)
    setMensaje(null)

    try {
      await registrarMovimiento({
        producto_id: Number(form.producto_id),
        tipo: form.tipo,
        cantidad,
        motivo: form.motivo.trim() || undefined,
        usuario: form.usuario.trim() || undefined,
      })

      setMensaje({ tipo: 'ok', texto: 'Movimiento registrado.' })
      setHistorialId(Number(form.producto_id))
      setForm((f) => ({ ...f, cantidad: '', motivo: '' }))
      setVersion((v) => v + 1)
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message })
    } finally {
      setEnviando(false)
    }
  }

  // Estado de carga
  if (cargando) return <p>Cargando inventario...</p>

  // Estado de error
  if (error) return <p role="alert">{error}</p>

  /**
   * Producto correspondiente al historial seleccionado.
   *
   * @type {Object|undefined}
   */
  const productoHistorial = items.find((p) => p.id === historialId)

  return (
    // El JSX original de la página se mantiene sin cambios.
    // Aquí continúa la estructura de tablas, filtros,
    // historial y formulario de movimientos del inventario.
  )
}
