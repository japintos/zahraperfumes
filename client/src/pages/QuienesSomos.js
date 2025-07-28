import React from 'react';
import './QuienesSomos.css';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const vendedores = [
  {
    nombre: 'Gustavo Sequeira',
    rol: 'Vendedor',
  },
  {
    nombre: 'Sandra Pintos',
    rol: 'Vendedora',
  },
  {
    nombre: 'Julio Pintos',
    rol: 'Vendedor',
  },
];

const QuienesSomos = () => (
  <div className="about-container">
    <div className="about-logo" style={{textAlign: 'center', marginBottom: '24px'}}>
      <img src="/img/logodetalle.jpg" alt="Logo Zahra" style={{maxWidth: '160px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)'}} />
    </div>
    <div className="about-description">
      <p>
        Zahra es una perfumería unisex dedicada a la selección de fragancias importadas, imitaciones de alta calidad y perfumes árabes de carácter único. Cada producto es elegido por su capacidad de transmitir elegancia, misterio y belleza atemporal. Nos enfocamos en brindar una atención personalizada, responsable y cercana, asegurando que cada cliente encuentre una esencia que lo represente. Zahra es un espacio donde el aroma se convierte en identidad, y cada elección tiene significado.
      </p>
    </div>
    <h2>Vendedores</h2>
    <div className="sellers-list">
      {vendedores.map((v, idx) => (
        <div className="seller-card" key={idx}>
          <h3>{v.nombre}</h3>
          <p>{v.rol}</p>
          <div className="seller-social">
            <button className="social-btn"><FaFacebook /></button>
            <button className="social-btn"><FaInstagram /></button>
            <button className="social-btn"><FaWhatsapp /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default QuienesSomos;
