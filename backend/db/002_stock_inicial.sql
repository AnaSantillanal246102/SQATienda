-- Restricción de stock no negativo (falla si hay algún stock negativo)
ALTER TABLE productos
  ADD CONSTRAINT productos_stock_check CHECK (stock >= 0);

-- Registrar el stock actual como movimiento inicial (solo si aún no hay historial)
INSERT INTO movimientos_inventario
  (producto_id, tipo, cantidad, motivo, stock_resultante, usuario)
SELECT p.id, 'ajuste', p.stock, 'stock inicial', p.stock, 'sistema'
FROM productos p
WHERE p.stock > 0
  AND NOT EXISTS (
    SELECT 1 FROM movimientos_inventario m WHERE m.producto_id = p.id
  );