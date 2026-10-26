
-- ============================================================
-- Archivo: backend/db/init.sql
-- Descripción: Crea la tabla productos e inserta los datos
--              iniciales de MoraShop.
-- Autor: Jared Martinez
-- Versión: 1.0
-- Desde: 10/24/2028
-- ============================================================

-- Crear la tabla productos si todavía no existe.
CREATE TABLE IF NOT EXISTS productos (
    -- Identificador único autoincremental de cada producto.
    id SERIAL PRIMARY KEY,

    -- Nombre del producto. Es obligatorio.
    nombre VARCHAR(255) NOT NULL,

    -- Categoría a la que pertenece el producto. Es obligatoria.
    categoria VARCHAR(100) NOT NULL,

    -- Precio del producto con dos decimales. Es obligatorio.
    precio DECIMAL(10, 2) NOT NULL,

    -- Cantidad disponible en inventario. Por defecto es cero.
    stock INTEGER NOT NULL DEFAULT 0,

    -- Descripción detallada del producto.
    descripcion TEXT,

    -- Ruta de la imagen del producto.
    imagen VARCHAR(255),

    -- Indica si el producto aparece como destacado.
    -- Por defecto, el producto no está destacado.
    destacado BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- Insertar los 25 productos iniciales del catálogo.
-- Se especifican los valores de cada columna de la tabla.
-- ============================================================

INSERT INTO productos (
    id,
    nombre,
    categoria,
    precio,
    stock,
    descripcion,
    imagen,
    destacado
) VALUES
(1, 'NovaBook Ultra 17', 'Laptops', 38999, 5, 'Laptop de 17 pulgadas que reemplaza a una de escritorio, Ryzen 9, 32 GB RAM, SSD de 1 TB.', '/img/productos/1.jpg', false),
(2, 'NovaBook Lite 11', 'Laptops', 6499, 0, 'Laptop compacta de 11.6 pulgadas para estudiantes, 4 GB RAM, 64 GB eMMC.', '/img/productos/2.jpg', false),
(3, 'NovaBook Studio 15', 'Laptops', 47999, 3, 'Estación de trabajo de 15.6 pulgadas, Intel Core i7, 64 GB RAM, SSD de 2 TB, GPU RTX.', '/img/productos/3.jpg', false),
(4, 'NovaBook Go 14', 'Laptops', 12499, 20, 'Laptop de 14 pulgadas para el día a día, Intel Core i3, 8 GB RAM, SSD de 256 GB.', '/img/productos/4.jpg', true),
(5, 'NovaBook Pro 16', 'Laptops', 32499, 7, 'Laptop de 16 pulgadas para creadores, AMD Ryzen 7, 32 GB RAM, SSD de 1 TB, GPU dedicada.', '/img/productos/5.jpg', true),
(6, 'NovaBook Air 13', 'Laptops', 18999, 12, 'Laptop ultraligera de 13.3 pulgadas, Intel Core i5, 16 GB RAM, SSD de 512 GB. Ideal para profesionales en movimiento.', '/img/productos/6.jpg', true),
(7, 'NovaTower Mini', 'Desktops', 8499, 15, 'Mini PC compacta, Intel N100, 8 GB RAM, SSD de 256 GB y funcionamiento silencioso.', '/img/productos/7.jpg', false),
(8, 'NovaTower Workstation', 'Desktops', 89999, 2, 'Estación de trabajo profesional, Threadripper, 128 GB RAM, NVMe de 2 TB, GPU Quadro.', '/img/productos/8.jpg', false),
(9, 'NovaAllInOne 27', 'Desktops', 27999, 4, 'Equipo todo en uno de 27 pulgadas, Intel Core i7, 16 GB RAM, SSD de 512 GB y periféricos inalámbricos.', '/img/productos/9.jpg', true),
(10, 'NovaTower Gamer X', 'Desktops', 34999, 6, 'PC gamer con Ryzen 5, RTX 4060, 16 GB RAM, NVMe de 1 TB y ventiladores RGB.', '/img/productos/10.jpg', false),
(11, 'NovaTower Home', 'Desktops', 15999, 9, 'Torre familiar con Intel Core i5, 16 GB RAM, disco duro de 1 TB y SSD de 256 GB.', '/img/productos/11.jpg', false),
(12, 'NovaView 22 Basic', 'Monitores', 2199, 0, 'Monitor Full HD de 21.5 pulgadas, 60 Hz, VGA y HDMI, económico.', '/img/productos/12.jpg', false),
(13, 'NovaView 32 Pro', 'Monitores', 18999, 3, 'Monitor 4K de 31.5 pulgadas para creadores, 99% AdobeRGB y calibración por hardware.', '/img/productos/13.jpg', false),
(14, 'NovaView 34 Ultrawide', 'Monitores', 12999, 6, 'Monitor curvo ultrapanorámico de 34 pulgadas, 1440p, 144 Hz, 1 ms y HDR400.', '/img/productos/14.jpg', false),
(15, 'NovaView 27 4K', 'Monitores', 8999, 10, 'Monitor 4K UHD de 27 pulgadas, 60 Hz, 99% sRGB y carga USB-C de 65 W.', '/img/productos/15.jpg', false),
(16, 'NovaView 24 FHD', 'Monitores', 3499, 25, 'Monitor IPS Full HD de 23.8 pulgadas, 75 Hz, bordes delgados, HDMI y VGA.', '/img/productos/16.jpg', false),
(17, 'NovaType Slim Membrane', 'Teclados', 449, 40, 'Teclado de membrana delgado, teclas silenciosas, USB-C y resistente a derrames.', '/img/productos/17.jpg', false),
(18, 'NovaType Wireless 75', 'Teclados', 2299, 12, 'Teclado mecánico inalámbrico 75%, hot-swap y batería de 4000 mAh.', '/img/productos/18.jpg', false),
(19, 'NovaType RGB Full', 'Teclados', 1899, 18, 'Teclado mecánico RGB de tamaño completo, switches azules y descansa muñecas.', '/img/productos/19.jpg', false),
(20, 'NovaType Mechanical 87', 'Teclados', 1499, 30, 'Teclado mecánico TKL con switches intercambiables e iluminación RGB.', '/img/productos/20.jpg', false),
(21, 'NovaClick Mini Travel', 'Mouse', 349, 8, 'Mouse compacto de viaje, Bluetooth 5.2 y 6 meses de batería.', '/img/productos/21.jpg', false),
(22, 'NovaClick Office', 'Mouse', 399, 50, 'Mouse inalámbrico ambidiestro, clics silenciosos y 12 meses de batería.', '/img/productos/22.jpg', false),
(23, 'NovaClick Gamer 8K', 'Mouse', 1599, 14, 'Mouse gamer con cable, sondeo de 8K, 30K DPI y solo 58 g.', '/img/productos/23.jpg', false),
(24, 'NovaClick Pro Wireless', 'Mouse', 1299, 22, 'Mouse inalámbrico ergonómico, sensor de 26K DPI, 70 h de batería y USB-C.', '/img/productos/24.jpg', false),
(25, 'NovaSound Buds Pro', 'Audio', 1599, 0, 'Audífonos inalámbricos con cancelación de ruido, carga inalámbrica e IPX5.', '/img/productos/25.jpg', false);

-- ============================================================
-- Ajustar la secuencia del identificador.
-- Permite que el siguiente producto insertado automáticamente
-- reciba el ID 26, después de insertar los 25 productos.
-- ============================================================

SELECT setval(
    'productos_id_seq',
    (SELECT MAX(id) FROM productos)
);
