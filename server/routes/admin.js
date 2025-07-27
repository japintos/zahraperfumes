const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Middleware para verificar si es admin
const isAdmin = (req, res, next) => {
  // En un entorno real, verificarías el token JWT aquí
  // Por ahora, asumimos que es admin
  next();
};

// Dashboard - Estadísticas generales
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    // Estadísticas de ventas
    const [salesStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value,
        COUNT(CASE WHEN status = 'pendiente' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'entregado' THEN 1 END) as completed_orders
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    // Ventas por día (últimos 7 días)
    const [dailySales] = await pool.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Productos más vendidos
    const [topProducts] = await pool.execute(`
      SELECT 
        p.name,
        p.image1,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // Stock bajo
    const [lowStock] = await pool.execute(`
      SELECT id, name, stock, image1
      FROM products
      WHERE stock <= 5 AND is_active = 1
      ORDER BY stock ASC
      LIMIT 10
    `);

    res.json({
      success: true,
      dashboard: {
        salesStats: salesStats[0],
        dailySales,
        topProducts,
        lowStock
      }
    });

  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener todas las órdenes (admin)
router.get('/orders', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, u.first_name, u.last_name, u.email as user_email,
             COUNT(oi.id) as total_items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [orders] = await pool.execute(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM orders o';
    const countParams = [];

    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
      countParams.push(...params.slice(0, -2));
    }

    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener orden detallada (admin)
router.get('/orders/:orderId', isAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await pool.execute(`
      SELECT o.*, u.first_name, u.last_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderId]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    const order = orders[0];

    // Obtener items de la orden
    const [items] = await pool.execute(`
      SELECT oi.*, p.name as product_name, p.image1, p.description
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.id]);

    res.json({
      success: true,
      order: {
        ...order,
        items
      }
    });

  } catch (error) {
    console.error('Error obteniendo orden detallada:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener reporte de ventas
router.get('/reports/sales', isAdmin, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let dateFormat = '%Y-%m-%d';
    if (groupBy === 'month') {
      dateFormat = '%Y-%m';
    } else if (groupBy === 'year') {
      dateFormat = '%Y';
    }

    const [salesReport] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, ?) as period,
        COUNT(*) as orders,
        SUM(total_amount) as revenue,
        AVG(total_amount) as avg_order
      FROM orders
      WHERE created_at BETWEEN ? AND ?
      GROUP BY DATE_FORMAT(created_at, ?)
      ORDER BY period DESC
    `, [dateFormat, startDate, endDate, dateFormat]);

    res.json({
      success: true,
      report: salesReport
    });

  } catch (error) {
    console.error('Error obteniendo reporte de ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener productos con stock bajo
router.get('/products/low-stock', isAdmin, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const [products] = await pool.execute(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock <= 10 AND p.is_active = 1
      ORDER BY p.stock ASC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Error obteniendo productos con stock bajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener estadísticas de productos
router.get('/products/stats', isAdmin, async (req, res) => {
  try {
    const [productStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock,
        COUNT(CASE WHEN stock <= 5 THEN 1 END) as low_stock,
        AVG(price) as avg_price,
        SUM(stock) as total_stock
      FROM products
      WHERE is_active = 1
    `);

    // Productos por categoría
    const [productsByCategory] = await pool.execute(`
      SELECT c.name, COUNT(p.id) as count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      stats: productStats[0],
      byCategory: productsByCategory
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 