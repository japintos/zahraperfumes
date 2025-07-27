import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || '',
    payment_method: 'cash',
    notes: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getCartTotal()
      };

      const response = await axios.post('/api/orders', orderData);
      
      if (response.data.success) {
        clearCart();
        navigate(`/order-success/${response.data.order.order_number}`);
      }
    } catch (error) {
      console.error('Error al procesar la orden:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Finalizar Compra</h1>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Información de Contacto</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first_name" className="form-label">
                      <FaUser />
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name" className="form-label">
                      <FaUser />
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
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

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    <FaPhone />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Dirección de Envío</h3>
                
                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    <FaMapMarkerAlt />
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      <FaMapMarkerAlt />
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postal_code" className="form-label">
                      <FaMapMarkerAlt />
                      Código Postal
                    </label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Método de Pago</h3>
                
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={handleChange}
                    />
                    <span className="payment-label">
                      <FaCreditCard />
                      Efectivo
                    </span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment_method"
                      value="transfer"
                      checked={formData.payment_method === 'transfer'}
                      onChange={handleChange}
                    />
                    <span className="payment-label">
                      <FaCreditCard />
                      Transferencia Bancaria
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Notas Adicionales</h3>
                
                <div className="form-group">
                  <label htmlFor="notes" className="form-label">
                    Comentarios (opcional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-input"
                    rows="3"
                    placeholder="Instrucciones especiales para la entrega..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg checkout-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h3>Resumen del Pedido</h3>
            
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Cantidad: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="total-line total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 