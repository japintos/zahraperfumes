import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartCount = getCartCount();

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <img 
              src="/img/logominimalista.jpg" 
              alt="Sahra Perfumes" 
              className="logo-image"
            />
            <span className="logo-text">Sahra Perfumes</span>
          </Link>

          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Buscar perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Navegación desktop */}
          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/products" className="nav-link">Productos</Link>
            <Link to="/contact" className="nav-link">Contacto</Link>
            <Link to="/quienessomos" className="nav-link">Quiénes Somos</Link>
            
            {isAdmin && (
              <Link to="/admin" className="nav-link admin-link">
                Admin
              </Link>
            )}
          </nav>

          {/* Acciones del usuario */}
          <div className="header-actions">
            {/* Carrito */}
            <Link to="/cart" className="cart-button">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* Usuario */}
            {isAuthenticated ? (
              <div className="user-menu">
                <button className="user-button">
                  <FaUser />
                  <span className="user-name">{user?.first_name}</span>
                </button>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    Mi Perfil
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item">
                      Panel Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item">
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Menú móvil */}
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="nav-mobile">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/products" className="nav-link">Productos</Link>
            <Link to="/contact" className="nav-link">Contacto</Link>
            <Link to="/quienessomos" className="nav-link">Quiénes Somos</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link">Mi Perfil</Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link">Panel Admin</Link>
                )}
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                <Link to="/register" className="nav-link">Registrarse</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 