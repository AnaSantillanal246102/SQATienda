
import { Router } from 'express';

/**
 * Error personalizado para las operaciones del inventario.
 *
 * Permite asociar un código HTTP y datos adicionales
 * al error producido durante una operación.
 *
 * @author Jared Martinez
 * @version 1.0
 * @sincef 10/24/2028
 * @sincev 1.0
 */
export class ErrorInventario extends Error {
  /**
   * Crea un error relacionado con el inventario.
   *
   * @param {number} status Código de estado HTTP del error.
   * @param {string} mensaje Descripción del error.
   * @param {Object} extra Datos adicionales del error.
   */
  constructor(status, mensaje, extra = {}) {
    super(mensaje);
    this.status = status;
    this.extra = extra;
  }
}

/**
 * Registra un movimiento de inventario y actualiza el stock.
 *
 * Debe ejecutarse dentro de una transacción de base de datos
 * utilizando el cliente recibido como parámetro.
 *
 * Los movimientos pueden ser entradas, salidas o ajustes.
 *
 * @param {Object} client Cliente de PostgreSQL que ejecuta la transacción.
 * @param {Object} movimiento Datos del movimiento de inventario.
 * @param {number} movimiento.producto_id Identificador del producto.
 * @param {string} movimiento.tipo Tipo de movimiento: entrada, salida o ajuste.
 * @param {number} movimiento.cantidad Cantidad que se agrega, retira o establece.
 * @param {string} [movimiento.motivo] Motivo del movimiento.
 * @param {string} [movimiento.usuario] Usuario que registra el movimiento.
 * @return {Promise<Object>} Registro del movimiento creado.
 * @throws {ErrorInventario} Si el producto no existe, el stock es insuficiente
 * o el ajuste coincide con el stock actual.
 * @see ErrorInventario
 */
export async function registrarMovimiento(
  client,
  { producto_id, tipo, cantidad, motivo, usuario }
) {
  // Consulta el stock actual y bloquea la fila para evitar
  // modificaciones simultáneas durante la transacción.
  const { rows } = await client.query(
    'SELECT stock FROM productos WHERE id = $1 FOR UPDATE',
    [producto_id]
  );

  // Comprueba que el producto exista en la base de datos.
  if (rows.length === 0) {
    throw new ErrorInventario(404, 'Producto no encontrado');
  }

  // Obtiene el stock actual del producto.
  const actual = rows[0].stock;

  // Variables para almacenar el nuevo stock y la cantidad registrada.
  let nuevo;
  let registrada = cantidad;

  // Si es una entrada, suma unidades al stock.
  if (tipo === 'entrada') {
    nuevo = actual + cantidad;

  // Si es una salida, resta unidades del stock.
  } else if (tipo === 'salida') {
    nuevo = actual - cantidad;

  } else {
    // En un ajuste, cantidad representa el conteo físico real.
    // Se registra la diferencia absoluta respecto al stock anterior.
    nuevo = cantidad;
    registrada = Math.abs(nuevo - actual);
  }

  // Evita que el inventario termine con una cantidad negativa.
  if (nuevo < 0) {
    throw new ErrorInventario(
      409,
      'Stock insuficiente',
      { stock: actual }
    );
  }

  // Evita registrar movimientos que no modifican el inventario.
  if (registrada === 0) {
    throw new ErrorInventario(
      400,
      'El conteo coincide con el stock actual'
    );
  }

  // Actualiza el stock del producto en la base de datos.
  await client.query(
    'UPDATE productos SET stock = $1 WHERE id = $2',
    [nuevo, producto_id]
  );

  // Registra el movimiento y devuelve el registro creado.
  const { rows: mov } = await client.query(
    `INSERT INTO movimientos_inventario
       (producto_id, tipo, cantidad, motivo, stock_resultante, usuario)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      producto_id,
      tipo,
      registrada,
      motivo || null,
      nuevo,
      usuario || null
    ]
  );

  return mov[0];
}

/**
 * Crea y configura las rutas de la API de inventario.
 *
 * @param {Object} pool Grupo de conexiones a PostgreSQL.
 * @return {Object} Router de Express con las rutas del inventario.
 * @since 1.0
 * @see ErrorInventario
 * @see registrarMovimiento
 */
export default function crearRouterInventario(pool) {
  // Crea el enrutador de Express.
  const router = Router();

  /**
   * Obtiene el inventario actual de todos los productos.
   *
   * Incluye un indicador que señala si el stock está
   * por debajo o es igual al mínimo establecido.
   *
   * @return {Array<Object>} Lista de productos con su inventario.
   */
  router.get('/', async (req, res) => {
    try {
      // Consulta el stock y calcula si cada producto tiene stock bajo.
      const { rows } = await pool.query(
        `SELECT id, nombre, categoria, stock, stock_minimo,
                (stock <= stock_minimo) AS stock_bajo
         FROM productos
         ORDER BY nombre`
      );

      // Devuelve el inventario en formato JSON.
      res.json(rows);
    } catch (err) {
      // Registra el error y responde con un estado HTTP 500.
      console.error(err);
      res.status(500).json({
        error: 'Error al obtener el inventario'
      });
    }
  });

  /**
   * Obtiene los movimientos registrados de un producto.
   *
   * @param {number} req.params.id Identificador del producto solicitado.
   * @return {Array<Object>} Historial de hasta 100 movimientos.
   */
  router.get('/:id/movimientos', async (req, res) => {
    // Convierte el ID recibido en la URL a un número.
    const id = Number(req.params.id);

    // Comprueba que el ID sea un número entero.
    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: 'ID inválido'
      });
    }

    try {
      // Busca los movimientos más recientes del producto.
      const { rows } = await pool.query(
        `SELECT * FROM movimientos_inventario
         WHERE producto_id = $1
         ORDER BY creado_en DESC, id DESC
         LIMIT 100`,
        [id]
      );

      // Devuelve el historial en formato JSON.
      res.json(rows);
    } catch (err) {
      // Registra el error y notifica que no se pudo consultar el historial.
      console.error(err);
      res.status(500).json({
        error: 'Error al obtener los movimientos'
      });
    }
  });

  /**
   * Registra una entrada, salida o ajuste de inventario.
   *
   * Valida los datos recibidos y ejecuta la operación dentro
   * de una transacción para mantener la consistencia de los datos.
   *
   * @param {Object} req Solicitud HTTP con los datos del movimiento.
   * @param {Object} res Respuesta HTTP que se enviará al cliente.
   * @return {Promise<void>} Envía el resultado o el error de la operación.
   * @throws {ErrorInventario} Si ocurre un error controlado del inventario.
   */
  router.post('/movimientos', async (req, res) => {
    // Extrae los datos enviados en el cuerpo de la solicitud.
    const { producto_id, tipo, cantidad, motivo, usuario } = req.body;

    // Convierte los identificadores y las cantidades a números.
    const pid = Number(producto_id);
    const cant = Number(cantidad);

    // Los ajustes pueden establecer el stock en cero;
    // las entradas y salidas requieren al menos una unidad.
    const minimo = tipo === 'ajuste' ? 0 : 1;

    // Valida el identificador, el tipo de movimiento y la cantidad.
    if (
      !Number.isInteger(pid) ||
      !['entrada', 'salida', 'ajuste'].includes(tipo) ||
      !Number.isInteger(cant) ||
      cant < minimo
    ) {
      return res.status(400).json({
        error: 'Datos inválidos'
      });
    }

    // Obtiene una conexión dedicada para ejecutar la transacción.
    const client = await pool.connect();

    try {
      // Inicia la transacción.
      await client.query('BEGIN');

      // Registra el movimiento y actualiza el stock.
      const mov = await registrarMovimiento(client, {
        producto_id: pid,
        tipo,
        cantidad: cant,
        motivo,
        usuario,
      });

      // Confirma los cambios realizados en la base de datos.
      await client.query('COMMIT');

      // Devuelve el movimiento creado con el estado HTTP 201.
      res.status(201).json(mov);
    } catch (err) {
      // Revierte los cambios si ocurre un error.
      await client.query('ROLLBACK');

      // Devuelve los errores controlados con su código HTTP.
      if (err instanceof ErrorInventario) {
        return res.status(err.status).json({
          error: err.message,
          ...err.extra
        });
      }

      // Registra errores inesperados y responde con HTTP 500.
      console.error(err);
      res.status(500).json({
        error: 'Error al registrar el movimiento'
      });
    } finally {
      // Libera la conexión para que pueda reutilizarse.
      client.release();
    }
  });

  // Devuelve el enrutador configurado.
  return router;
}
