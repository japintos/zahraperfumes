-- Crear base de datos
CREATE DATABASE IF NOT EXISTS sahra_perfumes_db;
USE sahra_perfumes_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(10),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category_id INT,
  gender ENUM('hombre', 'mujer', 'unisex') DEFAULT 'unisex',
  type ENUM('original', 'importado', 'imitacion') DEFAULT 'original',
  image1 VARCHAR(255),
  image2 VARCHAR(255),
  image3 VARCHAR(255),
  image4 VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  customer_postal_code VARCHAR(10),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL,
  status ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de items de orden
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías por defecto
INSERT INTO categories (name, description) VALUES
('Fragancias Masculinas', 'Perfumes para hombres'),
('Fragancias Femeninas', 'Perfumes para mujeres'),
('Fragancias Unisex', 'Perfumes para ambos géneros'),
('Fragancias Importadas', 'Perfumes de marcas internacionales'),
('Fragancias Originales', 'Perfumes de marcas originales'),
('Fragancias de Imitación', 'Perfumes de imitación de alta calidad');

-- Insertar usuario admin por defecto (password: admin123)
INSERT INTO users (email, password, first_name, last_name, is_admin) VALUES
('admin@sahraperfumes.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Sahra', TRUE);

-- Insertar algunos productos de ejemplo
INSERT INTO products (name, description, price, stock, category_id, gender, type, image1) VALUES
('Chanel N°5', 'Fragancia icónica de Chanel', 150.00, 10, 2, 'mujer', 'original', 'chanel-n5.jpg'),
('Dior Sauvage', 'Fragancia masculina de Dior', 120.00, 15, 1, 'hombre', 'original', 'dior-sauvage.jpg'),
('Versace Eros', 'Fragancia masculina de Versace', 95.00, 8, 1, 'hombre', 'importado', 'versace-eros.jpg'),
('Marc Jacobs Daisy', 'Fragancia femenina fresca', 85.00, 12, 2, 'mujer', 'original', 'marc-jacobs-daisy.jpg'),
('CK One', 'Fragancia unisex de Calvin Klein', 65.00, 20, 3, 'unisex', 'original', 'ck-one.jpg'); 