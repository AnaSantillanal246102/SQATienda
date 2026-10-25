import { Computer, Cpu, Headphones, Keyboard, Laptop, Monitor, Mouse, Tablet } from 'lucide-react'

export const FONDO_DEFECTO = 'linear-gradient(135deg, #e2e8f0, #cbd5e1)'

export const CATEGORIAS = {
  Laptops: { Icono: Laptop, fondo: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' },
  Desktops: { Icono: Computer, fondo: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
  Monitores: { Icono: Monitor, fondo: 'linear-gradient(135deg, #cffafe, #a5f3fc)' },
  Audio: { Icono: Headphones, fondo: 'linear-gradient(135deg, #fae8ff, #f5d0fe)' },
  Teclados: { Icono: Keyboard, fondo: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  Mouse: { Icono: Mouse, fondo: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' },
  Componentes: { Icono: Cpu, fondo: 'linear-gradient(135deg, #fee2e2, #fecaca)' },
  Tablets: { Icono: Tablet, fondo: 'linear-gradient(135deg, #ffedd5, #fed7aa)' },
}