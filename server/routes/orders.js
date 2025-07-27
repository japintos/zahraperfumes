const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

const router = express.Router();

// Crear orden
router.post('/', [
  body('customer_name').notEmpty().trim(),
  body('customer_email').isEmail().normalizeEmail(),
  body('customer_phone').optional().trim(),
  body('customer_address').notEmpty().trim(),
  body('customer_city').notEmpty().trim(),
  body('customer_postal_code').optional().trim(),
  body('payment_method').isIn(['efectivo', 'tarjeta', 'transferencia']),
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isInt(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('user_id').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_postal_code,
      payment_method,
      items,
      user_id,
      notes
    } = req.body;

    // Generar número de orden único
    const orderNumber = 'SAHRA-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // Calcular total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const [products] = await pool.execute(
        'SELECT id, name, price, stock FROM products WHERE id = ? AND is_active = 1',
        [item.product_id]
      );

      if (products.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Producto con ID ${item.product_id} no encontrado`
        });
      }

      const product = products[0];

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: itemTotal,
        product_name: product.name
      });
    }

    // Crear orden
    const [orderResult] = await pool.execute(`
      INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, 
                         customer_address, customer_city, customer_postal_code, total_amount, 
                         payment_method, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderNumber,
      user_id || null,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_postal_code,
      totalAmount,
      payment_method,
      notes
    ]);

    const orderId = orderResult.insertId;

    // Crear items de orden
    for (const item of orderItems) {
      await pool.execute(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?)
      `, [
        orderId,
        item.product_id,
        item.quantity,
        item.unit_price,
        item.total_price
      ]);

      // Actualizar stock
      await pool.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      order: {
        id: orderId,
        order_number: orderNumber,
        total_amount: totalAmount,
        items: orderItems
      }
    });

  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener orden por número
router.get('/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const [orders] = await pool.execute(`
      SELECT o.*, u.first_name, u.last_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.order_number = ?
    `, [orderNumber]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    const order = orders[0];

    // Obtener items de la orden
    const [items] = await pool.execute(`
      SELECT oi.*, p.name as product_name, p.image1
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
    console.error('Error obteniendo orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener órdenes de usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const [orders] = await pool.execute(`
      SELECT o.*, 
             COUNT(oi.id) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, parseInt(limit), offset]);

    // Contar total de órdenes
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [userId]
    );

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
    console.error('Error obteniendo órdenes de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar estado de orden (solo admin)
router.patch('/:orderId/status', [
  body('status').isIn(['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const [result] = await pool.execute(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Estado de orden actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando estado de orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 