
import { NOMBRE_TIENDA } from '../config'
import './Hero.css'

/**
 * Componente principal de presentación de la tienda.
 *
 * Muestra una sección de bienvenida con el nombre de la tienda,
 * un mensaje promocional, un enlace al catálogo y una ilustración
 * decorativa de una laptop.
 *
 * La inicial del nombre de la tienda se utiliza como logotipo
 * dentro de la ilustración.
 *
 * @author Jonathan Trejo
 * @version 1.0
 * @since 1.0
 * @return {JSX.Element} Sección principal de presentación de la tienda.
 * @see /config/NOMBRE_TIENDA
 */


export default function Hero() {

  // Obtiene la primera letra del nombre de la tienda en minúscula.
  const inicial = NOMBRE_TIENDA.charAt(0).toLowerCase()

  return (
    // Sección principal identificada por el título para accesibilidad.
    <section className="hero" aria-labelledby="hero-titulo">

      {/* Contenido textual de presentación */}
      <div className="hero-copy">

        {/* Etiqueta promocional que destaca las novedades */}
        <p className="eyebrow">LO MÁS NUEVO</p>

        {/* Título principal de la sección */}
        <h1 id="hero-titulo">
          Todo lo que necesitas<br />
          <span>Está aquí.</span>
        </h1>

        {/* Descripción de los productos disponibles en la tienda */}
        <p className="hero-text">
          Laptops, desktops, monitores y accesorios para estudiar, crear, trabajar y jugar.
          Encuentra el equipo que va contigo.
        </p>

        {/* Enlace que dirige al catálogo de productos */}
        <a className="primary-link" href="#catalogo">
          Explorar catálogo <span aria-hidden="true">↗</span>
        </a>

        {/* Aviso sobre las condiciones de la compra demostrativa */}
        <p className="hero-note">
          Compra demostrativa · IVA desglosado · Sin cobros reales
        </p>
      </div>

      {/* Ilustración visual de una laptop azul */}
      <div
        className="hero-art"
        role="img"
        aria-label="Ilustración de una laptop azul"
      >

        {/* Imagen decorativa del robot */}
        <img
          src="/img/robot.png"
          alt=""
          className="hero-robot"
          width="110"
          height="140"
        />

        {/* Pantalla de la laptop ilustrada */}
        <div className="laptop-screen">

          {/* Efecto visual de iluminación de la pantalla */}
          <div className="screen-glow"></div>

          {/* Logotipo formado por la inicial de la tienda */}
          <div className="screen-logo">
            {inicial}<span>.</span>
          </div>
        </div>

        {/* Base de la laptop */}
        <div className="laptop-base"></div>

        {/* Elementos decorativos que simulan órbitas */}
        <div className="art-orbit orbit-one"></div>
        <div className="art-orbit orbit-two"></div>

        {/* Etiqueta flotante con el nombre de la tienda y su número */}
        <span className="floating-chip">
          {NOMBRE_TIENDA.toUpperCase()} / 01
        </span>
      </div>
    </section>
  )
}
