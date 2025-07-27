import React from 'react';
import { FaChartLine, FaShoppingCart, FaUsers, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import './Admin.css';

const Dashboard = () => {
  // Datos de ejemplo para demo
  const stats = {
    totalSales: 15420,
    totalOrders: 47,
    totalCustomers: 23,
    averageOrder: 328
  };

  const topProducts = [
    { id: 1, name: 'Chanel N°5', sales: 12, revenue: 2400 },
    { id: 2, name: 'Dior Sauvage', sales: 8, revenue: 1600 },
    { id: 3, name: 'Versace Eros', sales: 6, revenue: 900 },
    { id: 4, name: 'Paco Rabanne 1 Million', sales: 5, revenue: 750 }
  ];

  const lowStock = [
    { id: 1, name: 'Chanel N°5', stock: 2, threshold: 5 },
    { id: 2, name: 'Dior Sauvage', stock: 1, threshold: 5 },
    { id: 3, name: 'Versace Eros', stock: 3, threshold: 5 }
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>Ventas Totales</h3>
            <p className="stat-value">${stats.totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Órdenes</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Clientes</h3>
            <p className="stat-value">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Promedio por Orden</h3>
            <p className="stat-value">${stats.averageOrder}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Productos más vendidos */}
        <div className="dashboard-section">
          <h2>Productos Más Vendidos</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Ventas</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sales}</td>
                    <td>${product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Productos con bajo stock */}
        <div className="dashboard-section">
          <h2>Productos con Bajo Stock</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                  <th>Umbral</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>{product.threshold}</td>
                    <td>
                      <span className={`status-badge ${product.stock <= product.threshold ? 'warning' : 'success'}`}>
                        {product.stock <= product.threshold ? 'Bajo Stock' : 'OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 