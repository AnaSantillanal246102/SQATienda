
import { readFile, writeFile, mkdir } from 'node:fs/promises'

/**
 * Script para descargar las imágenes de los productos y guardarlas localmente, desarrollado para pruebas locales. No se utiliza en producción.
 *
 * Lee los productos desde un archivo JSON, descarga las imágenes que tienen
 * una URL externa, las guarda en la carpeta pública y actualiza las rutas
 * de las imágenes en el archivo original.
 *
 * @author Ana Santillan
 * @version 1.0
 * @sincef 10/25/2028
 * @sincev 1.0
 * @see src/data/products.json
 */

// Ruta del archivo JSON que contiene los productos
const ruta = 'src/data/products.json'

// Lee el archivo JSON y convierte su contenido en un arreglo de productos
const productos = JSON.parse(await readFile(ruta, 'utf8'))

// Crea la carpeta para guardar las imágenes, si no existe
await mkdir('public/img/productos', { recursive: true })

// Recorre cada producto del arreglo
for (const p of productos) {

  // Omite los productos cuya imagen no tenga una URL externa
  if (!p.imagen.startsWith('http')) continue

  // Descarga la imagen desde la dirección URL del producto
  const respuesta = await fetch(p.imagen)

  // Comprueba si la descarga fue exitosa
  if (!respuesta.ok) {
    console.warn(`✗ ${p.nombre}: error HTTP ${respuesta.status}`)
    continue
  }

  // Guarda la imagen descargada en la carpeta pública con el ID del producto
  await writeFile(
    `public/img/productos/${p.id}.jpg`,
    Buffer.from(await respuesta.arrayBuffer())
  )

  // Actualiza la ruta de la imagen para utilizar el archivo local
  p.imagen = `/img/productos/${p.id}.jpg`

  // Muestra un mensaje indicando que se procesó el producto
  console.log(`✓ ${p.nombre}`)
}

// Guarda el arreglo actualizado en el archivo JSON con formato legible
await writeFile(ruta, JSON.stringify(productos, null, 2) + '\n')
