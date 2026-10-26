// src/pages/InventarioPage.jsx
import { useState, useEffect, useMemo, useRef } from 'react'
import { obtenerInventario, obtenerMovimientos, registrarMovimiento } from '../services/inventarioService'
import { estadoStock, stockResultante, variacion, formatearVariacion } from '../utils/inventario'
import EmptyState from '../components/EmptyState'

const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const FORM_INICIAL = { producto_id: '', tipo: 'entrada', cantidad: '', motivo: '', usuario: '' }
const ETIQUETA_TIPO = { entrada: 'Entrada', salida: 'Salida', ajuste: 'Ajuste' }
const formatearFecha = (iso) =>
  new Date(iso).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })

export default function InventarioPage() {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0) // al cambiar, se vuelve a cargar todo

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
        if (activo) setError('No se pudo cargar el inventario. Verifica que el backend esté corriendo.')
      } finally {
        if (activo) setCargando(false)
      }
    }
    cargar()
    return () => { activo = false }
  }, [version])

  useEffect(() => {
    if (historialId === null) return
    let activo = true
    obtenerMovimientos(historialId)
      .then((filas) => { if (activo) setHistorial({ id: historialId, filas }) })
      .catch((err) => {
        console.error(err)
        if (activo) setHistorial({ id: historialId, filas: null })
      })
    return () => { activo = false }
  }, [historialId, version])

  const categorias = useMemo(
    () => [...new Set(items.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es')),
    [items]
  )
  const totalBajos = useMemo(() => items.filter((p) => estadoStock(p).clase !== 'ok').length, [items])
  const lista = useMemo(() => {
    const t = normalizar(busqueda.trim())
    return items.filter(
      (p) =>
        (!categoria || p.categoria === categoria) &&
        (!soloBajo || estadoStock(p).clase !== 'ok') &&
        (!t || normalizar(`${p.nombre} ${p.categoria}`).includes(t))
    )
  }, [items, busqueda, categoria, soloBajo])

  // --- Estado derivado del formulario ---
  const productoForm = items.find((p) => String(p.id) === form.producto_id)
  const cantidad = form.cantidad === '' ? NaN : Number(form.cantidad)
  const minimo = form.tipo === 'ajuste' ? 0 : 1 // un ajuste puede dejar el stock en 0
  const cantidadValida = Number.isInteger(cantidad) && cantidad >= minimo
  const resultado = productoForm && cantidadValida ? stockResultante(productoForm.stock, form.tipo, cantidad) : null
  const sinStock = resultado !== null && resultado < 0
  const sinCambio = resultado !== null && resultado === productoForm.stock
  const puedeEnviar = Boolean(productoForm) && cantidadValida && !sinStock && !sinCambio && !enviando

  let avisoStock = ''
  if (resultado !== null) {
    if (sinStock) avisoStock = `Stock insuficiente: hay ${productoForm.stock}.`
    else if (sinCambio) avisoStock = 'El conteo coincide con el stock actual.'
    else avisoStock = `Stock después del movimiento: ${resultado}`
  }

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  function prepararMovimiento(p) {
    setForm((f) => ({ ...f, producto_id: String(p.id) }))
    setMensaje(null)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    cantidadRef.current?.focus({ preventScroll: true })
  }

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

  if (cargando) return <p>Cargando inventario...</p>
  if (error) return <p role="alert">{error}</p>

  const productoHistorial = items.find((p) => p.id === historialId)

  return (
    <section>
      <h1>Inventario</h1>

      <div className="layout">
        <div className="stack">
          <div className="toolbar toolbar--inv">
            <input
              type="search"
              placeholder="Buscar en el inventario..."
              aria-label="Buscar en el inventario"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <select
              aria-label="Filtrar por categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="chips" role="group" aria-label="Filtro de stock">
            <button
              type="button"
              className={`chip${!soloBajo ? ' chip--active' : ''}`}
              aria-pressed={!soloBajo}
              onClick={() => setSoloBajo(false)}
            >
              Todos ({items.length})
            </button>
            <button
              type="button"
              className={`chip${soloBajo ? ' chip--active' : ''}`}
              aria-pressed={soloBajo}
              onClick={() => setSoloBajo(true)}
            >
              Stock bajo ({totalBajos})
            </button>
          </div>

          {lista.length === 0 ? (
            <EmptyState titulo="No hay productos con ese filtro">
              <p>Prueba con otra búsqueda o categoría.</p>
            </EmptyState>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <caption className="sr-only">Existencias por producto</caption>
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Categoría</th>
                    <th scope="col" className="num">Stock</th>
                    <th scope="col" className="num">Mínimo</th>
                    <th scope="col">Estado</th>
                    <th scope="col"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((p) => {
                    const est = estadoStock(p)
                    return (
                      <tr key={p.id} className={est.clase !== 'ok' ? 'row--low' : undefined}>
                        <th scope="row">{p.nombre}</th>
                        <td>{p.categoria}</td>
                        <td className="num"><strong>{p.stock}</strong></td>
                        <td className="num">{p.stock_minimo}</td>
                        <td><span className={`badge badge--${est.clase}`}>{est.texto}</span></td>
                        <td>
                          <div className="table__actions">
                            <button
                              type="button"
                              className="btn btn--sm"
                              aria-label={`Registrar movimiento de ${p.nombre}`}
                              onClick={() => prepararMovimiento(p)}
                            >
                              Movimiento
                            </button>
                            <button
                              type="button"
                              className="btn btn--sm btn--secondary"
                              aria-label={`Ver historial de ${p.nombre}`}
                              onClick={() => setHistorialId(p.id)}
                            >
                              Historial
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {historialId !== null && (
            <section aria-labelledby="historial-titulo">
              <div className="panel__head">
                <h2 id="historial-titulo">Historial: {productoHistorial?.nombre}</h2>
                <button type="button" className="link-btn" onClick={() => setHistorialId(null)}>
                  Cerrar historial
                </button>
              </div>

              {historial.id !== historialId ? (
                <p className="muted">Cargando historial...</p>
              ) : historial.filas === null ? (
                <p role="alert" className="error">No se pudo cargar el historial.</p>
              ) : historial.filas.length === 0 ? (
                <p className="muted">Este producto todavía no tiene movimientos.</p>
              ) : (
                <div className="table-wrap">
                  <table className="table">
                    <caption className="sr-only">Movimientos del producto, del más reciente al más antiguo</caption>
                    <thead>
                      <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Tipo</th>
                        <th scope="col" className="num">Cambio</th>
                        <th scope="col" className="num">Stock resultante</th>
                        <th scope="col">Motivo</th>
                        <th scope="col">Responsable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.filas.map((m, i) => (
                        <tr key={m.id}>
                          <td>{formatearFecha(m.creado_en)}</td>
                          <td>{ETIQUETA_TIPO[m.tipo]}</td>
                          <td className="num">{formatearVariacion(variacion(m, historial.filas[i + 1]))}</td>
                          <td className="num">{m.stock_resultante}</td>
                          <td>{m.motivo || '—'}</td>
                          <td>{m.usuario || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="panel panel--sticky" ref={formRef} aria-labelledby="mov-titulo">
          <form onSubmit={enviar} noValidate>
            <h2 id="mov-titulo">Registrar movimiento</h2>

            <div className="field">
              <label htmlFor="mov-producto">Producto</label>
              <select id="mov-producto" value={form.producto_id} onChange={cambiar('producto_id')}>
                <option value="">Selecciona un producto...</option>
                {items.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre} (stock {p.stock})</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="mov-tipo">Tipo</label>
              <select id="mov-tipo" value={form.tipo} onChange={cambiar('tipo')}>
                <option value="entrada">Entrada (compra, devolución)</option>
                <option value="salida">Salida (venta, merma)</option>
                <option value="ajuste">Ajuste (conteo físico)</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="mov-cantidad">{form.tipo === 'ajuste' ? 'Conteo real' : 'Cantidad'}</label>
              <input
                id="mov-cantidad"
                ref={cantidadRef}
                type="number"
                inputMode="numeric"
                min={minimo}
                step="1"
                value={form.cantidad}
                onChange={cambiar('cantidad')}
                aria-invalid={form.cantidad !== '' && !cantidadValida}
              />
              {form.tipo === 'ajuste' && (
                <p className="note">Escribe el total que contaste; el sistema guarda la diferencia.</p>
              )}
            </div>

            <p className={sinStock || sinCambio ? 'error' : 'note'} aria-live="polite">{avisoStock}</p>

            <div className="field">
              <label htmlFor="mov-motivo">Motivo (opcional)</label>
              <input id="mov-motivo" type="text" maxLength={100} value={form.motivo} onChange={cambiar('motivo')} />
            </div>

            <div className="field">
              <label htmlFor="mov-usuario">Responsable (opcional)</label>
              <input id="mov-usuario" type="text" maxLength={100} value={form.usuario} onChange={cambiar('usuario')} />
            </div>

            <button type="submit" className="btn btn--block" disabled={!puedeEnviar}>
              {enviando ? 'Guardando...' : 'Registrar movimiento'}
            </button>

            {mensaje?.tipo === 'ok' && <p role="status" className="success">{mensaje.texto}</p>}
            {mensaje?.tipo === 'error' && <p role="alert" className="error">{mensaje.texto}</p>}
          </form>
        </aside>
      </div>
    </section>
  )
}