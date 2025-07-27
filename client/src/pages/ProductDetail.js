import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import { FaShoppingCart, FaStar, FaArrowLeft } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    async () => {
      const response = await axios.get(`/api/products/${id}`);
      return response.data.product;
    }
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const getProductImages = () => {
    const images = [];
    if (product?.image1) images.push(product.image1);
    if (product?.image2) images.push(product.image2);
    if (product?.image3) images.push(product.image3);
    if (product?.image4) images.push(product.image4);
    return images;
  };

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no existe o ha sido eliminado.</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Volver a Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = getProductImages();

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft />
          Volver
        </button>

        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img
                src={images[selectedImage] ? `/uploads/${images[selectedImage]}` : '/img/placeholder.jpg'}
                alt={product.name}
              />
            </div>
            
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  >
                    <img
                      src={`/uploads/${image}`}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-badges">
                <span className={`badge badge-${product.gender}`}>
                  {product.gender}
                </span>
                <span className={`badge badge-${product.type}`}>
                  {product.type}
                </span>
              </div>
            </div>

            <div className="product-category">
              <span>Categoría: {product.category_name}</span>
            </div>

            <div className="product-price">
              <span className="price">${product.price.toFixed(2)}</span>
              {product.stock > 0 ? (
                <span className="stock in-stock">En stock ({product.stock} disponibles)</span>
              ) : (
                <span className="stock out-of-stock">Agotado</span>
              )}
            </div>

            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Cantidad:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                      className="quantity-input"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-lg add-to-cart-btn"
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart />
                  Agregar al Carrito
                </button>
              </div>
            )}

            <div className="product-details">
              <h3>Detalles del Producto</h3>
              <ul>
                <li><strong>Marca:</strong> {product.brand || 'N/A'}</li>
                <li><strong>Volumen:</strong> {product.volume || 'N/A'}</li>
                <li><strong>Concentración:</strong> {product.concentration || 'N/A'}</li>
                <li><strong>Notas:</strong> {product.notes || 'N/A'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 