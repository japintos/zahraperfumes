const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/database');

const router = express.Router();

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
  }
});

// Obtener todos los productos con filtros
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      gender,
      type,
      minPrice,
      maxPrice,
      sort = 'name',
      order = 'ASC',
      search
    } = req.query;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1
    `;
    
    const params = [];
    
    // Filtros
    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }
    
    if (gender) {
      query += ' AND p.gender = ?';
      params.push(gender);
    }
    
    if (type) {
      query += ' AND p.type = ?';
      params.push(type);
    }
    
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Ordenamiento
    const allowedSorts = ['name', 'price', 'created_at'];
    const allowedOrders = ['ASC', 'DESC'];
    const sortField = allowedSorts.includes(sort) ? sort : 'name';
    const sortOrder = allowedOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
    
    query += ` ORDER BY p.${sortField} ${sortOrder}`;
    
    // Paginación
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [products] = await pool.execute(query, params);
    
    // Contar total de productos para paginación
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM products p 
      WHERE p.is_active = 1
    `;
    
    const countParams = [];
    
    if (category) {
      countQuery += ' AND p.category_id = ?';
      countParams.push(category);
    }
    
    if (gender) {
      countQuery += ' AND p.gender = ?';
      countParams.push(gender);
    }
    
    if (type) {
      countQuery += ' AND p.type = ?';
      countParams.push(type);
    }
    
    if (minPrice) {
      countQuery += ' AND p.price >= ?';
      countParams.push(minPrice);
    }
    
    if (maxPrice) {
      countQuery += ' AND p.price <= ?';
      countParams.push(maxPrice);
    }
    
    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [products] = await pool.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.is_active = 1
    `, [id]);
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      product: products[0]
    });
    
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener categorías
router.get('/categories/all', async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');
    
    res.json({
      success: true,
      categories
    });
    
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear producto (solo admin)
router.post('/', upload.array('images', 4), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category_id,
      gender,
      type
    } = req.body;
    
    // Validaciones básicas
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son obligatorios'
      });
    }
    
    // Procesar imágenes
    const images = req.files || [];
    const imageFields = {};
    
    images.forEach((file, index) => {
      if (index < 4) {
        imageFields[`image${index + 1}`] = file.filename;
      }
    });
    
    // Insertar producto
    const [result] = await pool.execute(`
      INSERT INTO products (name, description, price, stock, category_id, gender, type, image1, image2, image3, image4)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      description,
      price,
      stock || 0,
      category_id || null,
      gender || 'unisex',
      type || 'original',
      imageFields.image1 || null,
      imageFields.image2 || null,
      imageFields.image3 || null,
      imageFields.image4 || null
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      productId: result.insertId
    });
    
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar producto (solo admin)
router.put('/:id', upload.array('images', 4), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      stock,
      category_id,
      gender,
      type
    } = req.body;
    
    // Verificar si el producto existe
    const [existingProducts] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    
    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    const existingProduct = existingProducts[0];
    
    // Procesar nuevas imágenes
    const images = req.files || [];
    const imageFields = {};
    
    // Mantener imágenes existentes si no se suben nuevas
    imageFields.image1 = existingProduct.image1;
    imageFields.image2 = existingProduct.image2;
    imageFields.image3 = existingProduct.image3;
    imageFields.image4 = existingProduct.image4;
    
    // Actualizar con nuevas imágenes
    images.forEach((file, index) => {
      if (index < 4) {
        imageFields[`image${index + 1}`] = file.filename;
      }
    });
    
    // Actualizar producto
    await pool.execute(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, gender = ?, type = ?, 
          image1 = ?, image2 = ?, image3 = ?, image4 = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name || existingProduct.name,
      description || existingProduct.description,
      price || existingProduct.price,
      stock !== undefined ? stock : existingProduct.stock,
      category_id || existingProduct.category_id,
      gender || existingProduct.gender,
      type || existingProduct.type,
      imageFields.image1,
      imageFields.image2,
      imageFields.image3,
      imageFields.image4,
      id
    ]);
    
    res.json({
      success: true,
      message: 'Producto actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar producto (solo admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el producto existe
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Soft delete - marcar como inactivo
    await pool.execute(
      'UPDATE products SET is_active = 0 WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 