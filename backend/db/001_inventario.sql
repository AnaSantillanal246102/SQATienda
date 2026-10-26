ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  ADD COLUMN IF NOT EXISTS stock_minimo INTEGER NOT NULL DEFAULT 2;

CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada','salida','ajuste')),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  motivo VARCHAR(100),
  stock_resultante INTEGER NOT NULL,
  usuario VARCHAR(100),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mov_producto
  ON movimientos_inventario(producto_id, creado_en DESC);