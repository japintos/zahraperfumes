import React, { useState } from 'react';
import { FaEye, FaPrint, FaCheck, FaTimes } from 'react-icons/fa';
import './Admin.css';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Datos de ejemplo para demo
  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      customerName: 'María González',
      customerEmail: 'maria@email.com',
      customerPhone: '123-456-7890',
      total: 380.00,
      status: 'completed',
      paymentMethod: 'Tarjeta de Crédito',
      createdAt: '2024-01-15',
      items: [
        { name: 'Chanel N°5', quantity: 1, price: 200.00 },
        { name: 'Dior Sauvage', quantity: 1, price: 180.00 }
      ],
      shippingAddress: {
        street: 'Av. Corrientes 1234',
        city: 'Buenos Aires',
        postalCode: '1043',
        country: 'Argentina'
      }
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      customerName: 'Juan Pérez',
      customerEmail: 'juan@email.com',
      customerPhone: '987-654-3210',
      total: 150.00,
      status: 'pending',
      paymentMethod: 'Efectivo',
      createdAt: '2024-01-16',
      items: [
        { name: 'Versace Eros', quantity: 1, price: 150.00 }
      ],
      shippingAddress: {
        street: 'Calle Florida 567',
        city: 'Buenos Aires',
        postalCode: '1005',
        country: 'Argentina'
      }
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      customerName: 'Ana López',
      customerEmail: 'ana@email.com',
      customerPhone: '555-123-4567',
      total: 280.00,
      status: 'processing',
      paymentMethod: 'Transferencia Bancaria',
      createdAt: '2024-01-17',
      items: [
        { name: 'Paco Rabanne 1 Million', quantity: 1, price: 160.00 },
        { name: 'Marc Jacobs Daisy', quantity: 1, price: 120.00 }
      ],
      shippingAddress: {
        street: 'Av. Santa Fe 890',
        city: 'Buenos Aires',
        postalCode: '1059',
        country: 'Argentina'
      }
    }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { text: 'Pendiente', class: 'warning' },
      'processing': { text: 'Procesando', class: 'info' },
      'completed': { text: 'Completada', class: 'success' },
      'cancelled': { text: 'Cancelada', class: 'danger' }
    };
    const statusInfo = statusMap[status] || { text: status, class: 'secondary' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handlePrintOrder = (order) => {
    console.log('Imprimir orden:', order.orderNumber);
    // Aquí iría la lógica de impresión
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log('Actualizar estado:', orderId, newStatus);
    // Aquí iría la lógica de actualización
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestión de Órdenes</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Método de Pago</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>
                  <div>
                    <strong>{order.customerName}</strong>
                    <br />
                    <small>{order.customerEmail}</small>
                  </div>
                </td>
                <td>${order.total}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{order.paymentMethod}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewOrder(order)}
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handlePrintOrder(order)}
                      title="Imprimir"
                    >
                      <FaPrint />
                    </button>
                    {order.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdateStatus(order.id, 'processing')}
                          title="Aprobar"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          title="Cancelar"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para ver detalles de la orden */}
      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>Detalles de la Orden - {selectedOrder.orderNumber}</h2>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="order-details">
                <div className="order-section">
                  <h3>Información del Cliente</h3>
                  <p><strong>Nombre:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Teléfono:</strong> {selectedOrder.customerPhone}</p>
                </div>

                <div className="order-section">
                  <h3>Dirección de Envío</h3>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>

                <div className="order-section">
                  <h3>Productos</h3>
                  <table className="order-items">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price}</td>
                          <td>${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3"><strong>Total</strong></td>
                        <td><strong>${selectedOrder.total}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="order-section">
                  <h3>Información de Pago</h3>
                  <p><strong>Método:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Estado:</strong> {getStatusBadge(selectedOrder.status)}</p>
                  <p><strong>Fecha:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handlePrintOrder(selectedOrder)}
                >
                  <FaPrint /> Imprimir Orden
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

export default Orders; 