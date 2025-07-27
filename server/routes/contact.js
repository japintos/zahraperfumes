const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

const router = express.Router();

// Crear mensaje de contacto
router.post('/', [
  body('name').notEmpty().trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('subject').notEmpty().trim().isLength({ min: 5 }),
  body('message').notEmpty().trim().isLength({ min: 10 })
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

    const { name, email, phone, subject, message } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO contacts (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `, [name, email, phone, subject, message]);

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
      contactId: result.insertId
    });

  } catch (error) {
    console.error('Error creando mensaje de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener mensajes de contacto (solo admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM contacts';
    const params = [];
    const conditions = [];

    if (isRead !== undefined) {
      conditions.push('is_read = ?');
      params.push(isRead === 'true' ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [contacts] = await pool.execute(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM contacts';
    const countParams = [];

    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
      countParams.push(...params.slice(0, -2));
    }

    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      success: true,
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo mensajes de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Marcar mensaje como leído (solo admin)
router.patch('/:contactId/read', async (req, res) => {
  try {
    const { contactId } = req.params;

    const [result] = await pool.execute(
      'UPDATE contacts SET is_read = 1 WHERE id = ?',
      [contactId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Mensaje marcado como leído'
    });

  } catch (error) {
    console.error('Error marcando mensaje como leído:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener estadísticas de contactos (solo admin)
router.get('/stats', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN is_read = 0 THEN 1 END) as unread_messages,
        COUNT(CASE WHEN is_read = 1 THEN 1 END) as read_messages,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as messages_this_week
      FROM contacts
    `);

    res.json({
      success: true,
      stats: stats[0]
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de contactos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 