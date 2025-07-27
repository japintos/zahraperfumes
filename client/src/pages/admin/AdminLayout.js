import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaChartLine, FaBox, FaShoppingCart, FaEnvelope, FaSignOutAlt, FaHome } from 'react-icons/fa';
import './Admin.css';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FaChartLine },
    { path: '/admin/products', label: 'Productos', icon: FaBox },
    { path: '/admin/orders', label: 'Órdenes', icon: FaShoppingCart },
    { path: '/admin/contacts', label: 'Contactos', icon: FaEnvelope }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Panel Admin</h2>
          <p>Bienvenido, {user?.name}</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link">
            <FaHome />
            <span>Volver al Sitio</span>
          </Link>
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 