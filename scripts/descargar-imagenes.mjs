import { readFile, writeFile, mkdir } from 'node:fs/promises'

const ruta = 'src/data/products.json'
const productos = JSON.parse(await readFile(ruta, 'utf8'))
await mkdir('public/img/productos', { recursive: true })

for (const p of productos) {
  if (!p.imagen.startsWith('http')) continue
  const respuesta = await fetch(p.imagen)
  if (!respuesta.ok) {
    console.warn(`✗ ${p.nombre}: error HTTP ${respuesta.status}`)
    continue
  }
  await writeFile(`public/img/productos/${p.id}.jpg`, Buffer.from(await respuesta.arrayBuffer()))
  p.imagen = `/img/productos/${p.id}.jpg`
  console.log(`✓ ${p.nombre}`)
}

await writeFile(ruta, JSON.stringify(productos, null, 2) + '\n')