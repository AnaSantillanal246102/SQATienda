// backend/routes/inventario.js
import { Router } from 'express';

export class ErrorInventario extends Error {
  constructor(status, mensaje, extra = {}) {
    super(mensaje);
    this.status = status;
    this.extra = extra;
  }
}

/**
 * Registra un movimiento y actualiza el stock.
 * Debe llamarse dentro de una transacción (BEGIN ... COMMIT) del `client`,
 * así más adelante la venta podrá reutilizarla para descontar stock.
 */
export async function registrarMovimiento(client, { producto_id, tipo, cantidad, motivo, usuario }) {
  // FOR UPDATE bloquea la fila: dos ventas simultáneas no pueden pisarse
  const { rows } = await client.query(
    'SELECT stock FROM productos WHERE id = $1 FOR UPDATE',
    [producto_id]
  );
  if (rows.length === 0) throw new ErrorInventario(404, 'Producto no encontrado');

  const actual = rows[0].stock;
  let nuevo;
  let registrada = cantidad;

  if (tipo === 'entrada') {
    nuevo = actual + cantidad;
  } else if (tipo === 'salida') {
    nuevo = actual - cantidad;
  } else {
    // ajuste: `cantidad` es el conteo físico real; se guarda la diferencia
    nuevo = cantidad;
    registrada = Math.abs(nuevo - actual);
  }

  if (nuevo < 0) throw new ErrorInventario(409, 'Stock insuficiente', { stock: actual });
  if (registrada === 0) throw new ErrorInventario(400, 'El conteo coincide con el stock actual');

  await client.query('UPDATE productos SET stock = $1 WHERE id = $2', [nuevo, producto_id]);

  const { rows: mov } = await client.query(
    `INSERT INTO movimientos_inventario
       (producto_id, tipo, cantidad, motivo, stock_resultante, usuario)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [producto_id, tipo, registrada, motivo || null, nuevo, usuario || null]
  );
  return mov[0];
}

export default function crearRouterInventario(pool) {
  const router = Router();

  // Inventario actual, con indicador de stock bajo
  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, nombre, categoria, stock, stock_minimo,
                (stock <= stock_minimo) AS stock_bajo
         FROM productos
         ORDER BY nombre`
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener el inventario' });
    }
  });

  // Historial de movimientos de un producto
  router.get('/:id/movimientos', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' });
    try {
      const { rows } = await pool.query(
        `SELECT * FROM movimientos_inventario
         WHERE producto_id = $1
         ORDER BY creado_en DESC, id DESC
         LIMIT 100`,
        [id]
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener los movimientos' });
    }
  });

  // Registrar un movimiento (entrada, salida o ajuste)
  router.post('/movimientos', async (req, res) => {
    const { producto_id, tipo, cantidad, motivo, usuario } = req.body;
    const pid = Number(producto_id);
    const cant = Number(cantidad);
    const minimo = tipo === 'ajuste' ? 0 : 1; // un ajuste puede dejar el stock en 0

    if (
      !Number.isInteger(pid) ||
      !['entrada', 'salida', 'ajuste'].includes(tipo) ||
      !Number.isInteger(cant) ||
      cant < minimo
    ) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const mov = await registrarMovimiento(client, {
        producto_id: pid, tipo, cantidad: cant, motivo, usuario,
      });
      await client.query('COMMIT');
      res.status(201).json(mov);
    } catch (err) {
      await client.query('ROLLBACK');
      if (err instanceof ErrorInventario) {
        return res.status(err.status).json({ error: err.message, ...err.extra });
      }
      console.error(err);
      res.status(500).json({ error: 'Error al registrar el movimiento' });
    } finally {
      client.release();
    }
  });

  return router;
}