import { NOMBRE_TIENDA } from '../config'
import './Hero.css'

// Diseño original del hero: (nombre de tu compañero)
export default function Hero() {
  const inicial = NOMBRE_TIENDA.charAt(0).toLowerCase()

  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <div className="hero-copy">
        <p className="eyebrow">LO MÁS NUEVO</p>
        <h1 id="hero-titulo">
          Todo lo que necesitas<br />
          <span>Está aquí.</span>
        </h1>
        <p className="hero-text">
          Laptops, desktops, monitores y accesorios para estudiar, crear, trabajar y jugar.
          Encuentra el equipo que va contigo.
        </p>
        <a className="primary-link" href="#catalogo">
          Explorar catálogo <span aria-hidden="true">↗</span>
        </a>
        <p className="hero-note">Compra demostrativa · IVA desglosado · Sin cobros reales</p>
      </div>

      <div className="hero-art" role="img" aria-label="Ilustración de una laptop azul">
        <img src="/img/robot.png" alt="" className="hero-robot" width="110" height="140" />
        <div className="laptop-screen">
          <div className="screen-glow"></div>
          <div className="screen-logo">{inicial}<span>.</span></div>
        </div>
        <div className="laptop-base"></div>
        <div className="art-orbit orbit-one"></div>
        <div className="art-orbit orbit-two"></div>
        <span className="floating-chip">{NOMBRE_TIENDA.toUpperCase()} / 01</span>
      </div>
    </section>
  )
}