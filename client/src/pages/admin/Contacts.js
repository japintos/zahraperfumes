import React, { useState } from 'react';
import { FaEye, FaCheck, FaEnvelope } from 'react-icons/fa';
import './Admin.css';

const Contacts = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Datos de ejemplo para demo
  const contacts = [
    {
      id: 1,
      name: 'Carlos Rodríguez',
      email: 'carlos@email.com',
      phone: '123-456-7890',
      subject: 'Consulta sobre envíos',
      message: 'Hola, me gustaría saber cuánto tiempo tarda el envío a Córdoba y si tienen opciones de envío express. Gracias.',
      status: 'unread',
      createdAt: '2024-01-15T10:30:00'
    },
    {
      id: 2,
      name: 'Laura Martínez',
      email: 'laura@email.com',
      phone: '987-654-3210',
      subject: 'Problema con mi pedido',
      message: 'Hice un pedido hace 3 días y aún no he recibido confirmación. El número de orden es ORD-2024-001. ¿Podrían verificar el estado?',
      status: 'read',
      createdAt: '2024-01-14T15:45:00'
    },
    {
      id: 3,
      name: 'Roberto Silva',
      email: 'roberto@email.com',
      phone: '555-123-4567',
      subject: 'Sugerencia de producto',
      message: 'Me encantaría que agreguen más perfumes masculinos de la marca Tom Ford. Son excelentes productos y tienen mucha demanda.',
      status: 'unread',
      createdAt: '2024-01-13T09:15:00'
    },
    {
      id: 4,
      name: 'Patricia Gómez',
      email: 'patricia@email.com',
      phone: '111-222-3333',
      subject: 'Felicitaciones',
      message: 'Excelente servicio y productos de muy buena calidad. Los recomiendo a todos mis amigos. ¡Sigan así!',
      status: 'read',
      createdAt: '2024-01-12T14:20:00'
    }
  ];

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleMarkAsRead = (messageId) => {
    console.log('Marcar como leído:', messageId);
    // Aquí iría la lógica real de actualización
  };

  const handleReply = (message) => {
    console.log('Responder a:', message.email);
    // Aquí iría la lógica de respuesta
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status === 'unread' ? 'warning' : 'success'}`}>
        {status === 'unread' ? 'No leído' : 'Leído'}
      </span>
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestión de Contactos</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Asunto</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id} className={contact.status === 'unread' ? 'unread-row' : ''}>
                <td>
                  <div>
                    <strong>{contact.name}</strong>
                    <br />
                    <small>{contact.phone}</small>
                  </div>
                </td>
                <td>{contact.email}</td>
                <td>{contact.subject}</td>
                <td>{getStatusBadge(contact.status)}</td>
                <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewMessage(contact)}
                      title="Ver mensaje"
                    >
                      <FaEye />
                    </button>
                    {contact.status === 'unread' && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleMarkAsRead(contact.id)}
                        title="Marcar como leído"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleReply(contact)}
                      title="Responder"
                    >
                      <FaEnvelope />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para ver detalles del mensaje */}
      {showModal && selectedMessage && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Mensaje de {selectedMessage.name}</h2>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="message-details">
                <div className="message-info">
                  <p><strong>De:</strong> {selectedMessage.name}</p>
                  <p><strong>Email:</strong> {selectedMessage.email}</p>
                  <p><strong>Teléfono:</strong> {selectedMessage.phone}</p>
                  <p><strong>Asunto:</strong> {selectedMessage.subject}</p>
                  <p><strong>Fecha:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  <p><strong>Estado:</strong> {getStatusBadge(selectedMessage.status)}</p>
                </div>

                <div className="message-content">
                  <h3>Mensaje:</h3>
                  <div className="message-text">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                {selectedMessage.status === 'unread' && (
                  <button 
                    className="btn btn-success"
                    onClick={() => {
                      handleMarkAsRead(selectedMessage.id);
                      setShowModal(false);
                    }}
                  >
                    <FaCheck /> Marcar como Leído
                  </button>
                )}
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleReply(selectedMessage)}
                >
                  <FaEnvelope /> Responder
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts; 