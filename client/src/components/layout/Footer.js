import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/img/logodetalle.jpg" alt="Sahra Perfumes" />
            </div>
            <p>
              Tu destino para encontrar las mejores fragancias. Ofrecemos una amplia 
              selección de perfumes originales, importados e imitaciones de alta calidad.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <FaFacebook />
              </a>
              <a href="#" className="social-link">
                <FaInstagram />
              </a>
              <a href="#" className="social-link">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul className="footer-links">
              <li><a href="/">Inicio</a></li>
              <li><a href="/products">Productos</a></li>
              <li><a href="/contact">Contacto</a></li>
              <li><a href="/login">Mi Cuenta</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Información de Contacto</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>Av. Principal 123, Buenos Aires</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+54 9 11 1234-5678</span>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <span>info@sahraperfumes.com</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3>Horarios de Atención</h3>
            <div className="business-hours">
              <div className="hours-item">
                <span>Lunes - Viernes:</span>
                <span>9:00 - 18:00</span>
              </div>
              <div className="hours-item">
                <span>Sábados:</span>
                <span>9:00 - 14:00</span>
              </div>
              <div className="hours-item">
                <span>Domingos:</span>
                <span>Cerrado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Sahra Perfumes. Todos los derechos reservados.</p>
            <div className="footer-bottom-links">
              <a href="/privacy">Política de Privacidad</a>
              <a href="/terms">Términos y Condiciones</a>
            </div>
          </div>
          <div className="developer-credits">
            <p>
              <strong>Diseño y Desarrollo:</strong> WebXpert - Desarrollador Julio Pintos
            </p>
            <p>Todos los derechos reservados de WebXpert</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 