
/**
 * Archivo: backend/index.js
 *
 * Descripción:
 * Configura e inicia el servidor backend de MoraShop.
 * Define la conexión con PostgreSQL, configura los middleware
 * y establece las rutas de la API para productos, categorías
 * e inventario.
 *
 * @author Jared Martinez
 * @version 1.0
 * @sincef 10/24/2028
 * @version 1.0
 * @sincev 1.0
 * @see crearRouterInventario
 */

import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import crearRouterInventario from './routes/inventario.js';

// Obtiene la clase Pool para administrar conexiones a PostgreSQL.
const { Pool } = pkg;

// NUMERIC (OID 1700) puede recibirse como texto.
// Si se necesita trabajar con estos valores como números,
// debe configurarse un analizador de tipos de PostgreSQL.

// Crea la aplicación de Express.
const app = express();

// Define el puerto en el que escuchará el servidor.
const port = 3001;

// ============================================================
// CONFIGURACIÓN DE MIDDLEWARE
// ============================================================

// Permite solicitudes desde otros orígenes mediante CORS.
app.use(cors());

// Permite recibir y procesar solicitudes con datos JSON.
app.use(express.json());

// ============================================================
// CONFIGURACIÓN DE LA CONEXIÓN A POSTGRESQL
// ============================================================

// Configura el grupo de conexiones a la base de datos.
// Los valores pueden establecerse mediante variables de entorno.
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sqatienda_db',
  password: process.env.DB_PASSWORD || 'admin123',
  port: Number(process.env.DB_PORT || 5433),
});

// ============================================================
// ENDPOINTS DE LA API
// ============================================================

/**
 * Obtiene todos los productos destacados.
 *
 * Esta ruta se declara antes de /api/productos/:id
 * para evitar que "destacados" se interprete como un ID.
 *
 * @param {Object} req Solicitud HTTP.
 * @param {Object} res Respuesta HTTP.
 * @return {Promise<void>} Envía los productos destacados en JSON.
 */
app.get('/api/productos/destacados', async (req, res) => {
  try {
    // Consulta los productos marcados como destacados.
    const result = await pool.query(
      'SELECT * FROM productos WHERE destacado = true'
    );

    // Devuelve la lista de productos destacados.
    res.json(result.rows);
  } catch (err) {
    // Registra el error y responde con un estado HTTP 500.
    console.error(err);
    res.status(500).json({
      error: 'Error al obtener destacados'
    });
  }
});

/**
 * Obtiene todos los productos registrados en la base de datos.
 *
 * @param {Object} req Solicitud HTTP.
 * @param {Object} res Respuesta HTTP.
 * @return {Promise<void>} Envía los productos ordenados por ID.
 */
app.get('/api/productos', async (req, res) => {
  try {
    // Consulta todos los productos en orden ascendente por ID.
    const result = await pool.query(
      'SELECT * FROM productos ORDER BY id ASC'
    );

    // Devuelve los productos en formato JSON.
    res.json(result.rows);
  } catch (err) {
    // Registra el error y devuelve una respuesta de fallo.
    console.error(err);
    res.status(500).json({
      error: 'Error al obtener productos'
    });
  }
});

/**
 * Obtiene un producto específico mediante su identificador.
 *
 * @param {Object} req Solicitud HTTP que contiene el ID en la URL.
 * @param {Object} res Respuesta HTTP.
 * @return {Promise<void>} Envía el producto encontrado o un error 404.
 */
app.get('/api/productos/:id', async (req, res) => {
  try {
    // Extrae el ID de los parámetros de la ruta.
    const { id } = req.params;

    // Busca el producto cuyo ID coincide con el recibido.
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );

    // Comprueba si el producto existe.
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    // Devuelve el primer registro encontrado.
    res.json(result.rows[0]);
  } catch (err) {
    // Registra el error y responde con HTTP 500.
    console.error(err);
    res.status(500).json({
      error: 'Error al obtener el producto'
    });
  }
});

/**
 * Obtiene las categorías únicas de los productos.
 *
 * @param {Object} req Solicitud HTTP.
 * @param {Object} res Respuesta HTTP.
 * @return {Promise<void>} Envía un arreglo con las categorías.
 */
app.get('/api/categorias', async (req, res) => {
  try {
    // Consulta las categorías sin repetir valores.
    const result = await pool.query(
      'SELECT DISTINCT categoria FROM productos'
    );

    // Convierte los registros en un arreglo de nombres de categorías.
    res.json(result.rows.map(row => row.categoria));
  } catch (err) {
    // Registra el error y devuelve una respuesta de fallo.
    console.error(err);
    res.status(500).json({
      error: 'Error al obtener categorías'
    });
  }
});

// ============================================================
// RUTAS DEL INVENTARIO
// ============================================================

// Registra las rutas del inventario bajo el prefijo /api/inventario.
// El pool permite que el enrutador consulte la base de datos.
app.use('/api/inventario', crearRouterInventario(pool));

// ============================================================
// INICIO DEL SERVIDOR
// ============================================================

// Inicia el servidor y muestra la dirección donde escucha.
app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
