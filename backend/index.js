// backend/index.js
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import crearRouterInventario from './routes/inventario.js';

const { Pool } = pkg;

// NUMERIC (oid 1700) llega como texto; lo convertimos a número


const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sqatienda_db',
  password: process.env.DB_PASSWORD || 'admin123',
  port: Number(process.env.DB_PORT || 5433),
});

// --- ENDPOINTS (API) ---

// Obtener productos destacados (DEBE IR ANTES QUE /:id)
app.get('/api/productos/destacados', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos WHERE destacado = true');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener destacados' });
  }
});

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Obtener categorías únicas
app.get('/api/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT categoria FROM productos');
    res.json(result.rows.map(row => row.categoria));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Inventario
app.use('/api/inventario', crearRouterInventario(pool));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
