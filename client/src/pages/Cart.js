import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart 
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos para comenzar a comprar</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Carrito de Compras</h1>
          <button onClick={clearCart} className="btn btn-outline">
            Vaciar Carrito
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image ? `/uploads/${item.image}` : '/img/placeholder.jpg'}
                  alt={item.name}
                  className="cart-item-image"
                />
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="cart-item-total">
                  <span className="total-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                  title="Eliminar del carrito"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Resumen del Pedido</h3>
            
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            
            <div className="summary-item">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            
            <div className="summary-total">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <Link to="/products" className="btn btn-outline">
                Seguir Comprando
              </Link>
              <Link to="/checkout" className="btn btn-primary">
                Proceder al Pago
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 