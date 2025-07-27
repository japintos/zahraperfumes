import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaUser, FaComments } from 'react-icons/fa';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post('/api/contact', formData);
      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Contáctanos</h1>
          <p>Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Información de Contacto</h3>
            
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <h4>Dirección</h4>
                <p>Av. Principal 123<br />Buenos Aires, Argentina</p>
              </div>
            </div>

            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <h4>Teléfono</h4>
                <p>+54 9 11 1234-5678</p>
              </div>
            </div>

            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <h4>Email</h4>
                <p>info@sahraperfumes.com</p>
              </div>
            </div>

            <div className="contact-item">
              <FaClock className="contact-icon" />
              <div>
                <h4>Horarios de Atención</h4>
                <p>Lunes a Viernes: 9:00 - 18:00<br />
                Sábados: 9:00 - 14:00<br />
                Domingos: Cerrado</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h3>Envíanos un Mensaje</h3>
            
            {submitStatus === 'success' && (
              <div className="alert alert-success">
                ¡Mensaje enviado exitosamente! Te responderemos pronto.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="alert alert-error">
                Hubo un error al enviar el mensaje. Inténtalo de nuevo.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <FaUser />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <FaEnvelope />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  <FaComments />
                    Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <FaComments />
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input"
                  rows="5"
                  placeholder="Escribe tu mensaje aquí..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 