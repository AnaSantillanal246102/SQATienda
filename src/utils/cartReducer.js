export function cartReducer(items, action) {
  switch (action.type) {
    case 'AGREGAR': {
      const { producto, cantidad } = action
      const existente = items.find((i) => i.id === producto.id)
      const nueva = Math.min((existente?.cantidad ?? 0) + cantidad, producto.stock)
      if (nueva < 1) return items
      if (existente) {
        return items.map((i) => (i.id === producto.id ? { ...i, cantidad: nueva } : i))
      }
      return [
        ...items,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          stock: producto.stock,
          imagen: producto.imagen,
          cantidad: nueva,
        },
      ]
    }
    case 'CAMBIAR':
      return items.map((i) =>
        i.id === action.id
          ? { ...i, cantidad: Math.min(Math.max(action.cantidad, 1), i.stock) }
          : i
      )
    case 'QUITAR':
      return items.filter((i) => i.id !== action.id)
    case 'VACIAR':
      return []
    case 'SINCRONIZAR':
      return items.flatMap((i) => {
        if (!Number.isInteger(i.cantidad) || i.cantidad < 1) return []
        const actual = action.productos.find((p) => p.id === i.id)
        if (!actual || actual.stock < 1) return []
        return [
          {
            ...i,
            nombre: actual.nombre,
            precio: actual.precio,
            stock: actual.stock,
            imagen: actual.imagen,
            cantidad: Math.min(i.cantidad, actual.stock),
          },
        ]
      })
    default:
      return items
  }
}