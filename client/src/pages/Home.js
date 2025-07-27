import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FaArrowRight, FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Obtener productos destacados
  const { data: featuredProducts, isLoading: productsLoading } = useQuery(
    'featuredProducts',
    async () => {
      const response = await axios.get('/api/products?limit=6&sort=created_at&order=DESC');
      return response.data.products;
    }
  );

  // Obtener categorías
  const { data: categories, isLoading: categoriesLoading } = useQuery(
    'categories',
    async () => {
      const response = await axios.get('/api/products/categories/all');
      return response.data.categories;
    }
  );

  // Auto-slide para el hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: "Fragancias Exclusivas",
      subtitle: "Descubre nuestra colección de perfumes únicos",
      image: "/img/hero-1.jpg",
      cta: "Ver Productos"
    },
    {
      title: "Marcas Originales",
      subtitle: "Perfumes de las mejores marcas internacionales",
      image: "/img/hero-2.jpg",
      cta: "Explorar"
    },
    {
      title: "Ofertas Especiales",
      subtitle: "Descuentos únicos en fragancias seleccionadas",
      image: "/img/hero-3.jpg",
      cta: "Ver Ofertas"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`
              }}
            >
              <div className="container">
                <div className="hero-content">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <Link to="/products" className="btn btn-primary btn-lg">
                    {slide.cta}
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Indicadores */}
          <div className="hero-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Explora por Categoría</h2>
            <p>Encuentra la fragancia perfecta para ti</p>
          </div>
          
          {categoriesLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="categories-grid">
              {categories?.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-card"
                >
                  <div className="category-content">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="category-link">
                      Ver productos <FaArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Productos Destacados</h2>
            <p>Las fragancias más populares de nuestra colección</p>
          </div>
          
          {productsLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-xl">
            <Link to="/products" className="btn btn-outline btn-lg">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de Beneficios */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaStar />
              </div>
              <h3>Calidad Garantizada</h3>
              <p>Todos nuestros productos son de la más alta calidad y autenticidad verificada.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaShoppingCart />
              </div>
              <h3>Envío Seguro</h3>
              <p>Enviamos a todo el país con embalaje especial para proteger tus fragancias.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaStar />
              </div>
              <h3>Atención Personalizada</h3>
              <p>Nuestro equipo te ayudará a encontrar la fragancia perfecta para ti.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para encontrar tu fragancia perfecta?</h2>
            <p>Explora nuestra amplia colección de perfumes y descubre nuevas sensaciones</p>
            <div className="cta-buttons">
              <Link to="/products" className="btn btn-primary btn-lg">
                Comenzar a Comprar
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Componente ProductCard
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image-container">
        <img
          src={product.image1 ? `/uploads/${product.image1}` : '/img/placeholder.jpg'}
          alt={product.name}
          className="product-image"
        />
        <button
          onClick={handleAddToCart}
          className="add-to-cart-btn"
          title="Agregar al carrito"
        >
          <FaShoppingCart />
        </button>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category_name}</p>
        <div className="product-price">
          <span className="price">${product.price.toFixed(2)}</span>
          {product.stock > 0 ? (
            <span className="stock in-stock">En stock</span>
          ) : (
            <span className="stock out-of-stock">Agotado</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Home; 