# 🛍️ Sahra Perfumes - Ecommerce

**Diseño y Desarrollo:** WebXpert - Desarrollador Julio Pintos  
**Todos los derechos reservados de WebXpert**

## 📋 Descripción

Ecommerce completo para Sahra Perfumes con funcionalidades avanzadas de gestión de productos, pedidos y administración.

## ✨ Características

### 🎨 Frontend (UX/UI)
- **Diseño moderno y responsive** - WebXpert
- **Navegación intuitiva** con logo minimalista en header
- **Compra como invitado** sin necesidad de registro
- **Registro opcional** para guardar información de envío
- **Carrito de compras** persistente
- **Filtros avanzados** por categoría, género, tipo y precio
- **Galería de productos** con hasta 4 imágenes por producto

### 🛍️ Gestión de Productos
- **Catálogo completo** con fotos y detalles
- **Filtros inteligentes:**
  - Por categoría (hombre, mujer, unisex)
  - Por tipo (original, importado, imitación)
  - Por precio (más barato a más caro)
- **Búsqueda en tiempo real**
- **Paginación optimizada**

### 👨‍💼 Panel de Administración
- **Dashboard comercial** con métricas de ventas
- **Gestión de productos** con carga de hasta 4 fotos
- **Gestión de pedidos** con detalles completos
- **Sección de contactos** con mensajes de clientes
- **Reportes de ventas** y productos más vendidos

### 📦 Gestión de Pedidos
- **Registro completo** de datos del cliente
- **Información de envío** detallada
- **Métodos de pago** (efectivo, transferencia)
- **Estados de pedido** (pendiente, procesando, enviado, entregado)

## 🛠️ Tecnologías

### Frontend
- **React.js** - Interfaz de usuario
- **React Router DOM** - Navegación
- **React Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP
- **React Icons** - Iconografía
- **React Toastify** - Notificaciones
- **CSS3** - Estilos y animaciones

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL2** - Base de datos
- **JWT** - Autenticación
- **Multer** - Subida de archivos
- **Bcryptjs** - Encriptación de contraseñas
- **Express-validator** - Validación de datos

### Base de Datos
- **MySQL** - Sistema de gestión de base de datos

## 🚀 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd sahra_perfumes
   ```

2. **Instalar dependencias:**
   ```bash
   npm run install-all
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con tus configuraciones de MySQL

4. **Configurar base de datos:**
   ```bash
   mysql -u root -p < server/config/init-db.sql
   ```

5. **Crear directorio de uploads:**
   ```bash
   mkdir uploads
   ```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 🌐 URLs de Acceso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Panel Admin:** http://localhost:3000/admin

### Credenciales de Administrador
- **Email:** admin@sahraperfumes.com
- **Password:** admin123

## 📁 Estructura del Proyecto

```
sahra_perfumes/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── contexts/       # Contextos de React
│   │   ├── pages/          # Páginas de la aplicación
│   │   └── styles/         # Estilos CSS
├── server/                 # Backend Node.js
│   ├── config/             # Configuración de BD
│   ├── routes/             # Rutas de la API
│   └── uploads/            # Archivos subidos
├── img/                    # Logos y assets
└── uploads/                # Imágenes de productos
```

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario:** #2c3e50 (Azul oscuro elegante)
- **Secundario:** #e74c3c (Rojo vibrante)
- **Acento:** #f39c12 (Naranja cálido)

### Tipografía
- **Inter** - Texto general
- **Playfair Display** - Títulos

### Logos
- **Header:** logo minimalista.jpg
- **Footer:** logo detalle.jpg

## 🔒 Seguridad

- **JWT** para autenticación
- **Bcrypt** para encriptación
- **Validación** de datos de entrada
- **CORS** configurado
- **Helmet** para headers de seguridad

## 📊 Funcionalidades de Administración

### Dashboard
- Ventas totales del mes
- Número de pedidos
- Clientes registrados
- Productos en catálogo
- Productos más vendidos
- Alertas de stock bajo

### Gestión de Productos
- Crear, editar, eliminar productos
- Subir hasta 4 imágenes por producto
- Gestión de stock
- Categorización

### Gestión de Pedidos
- Ver todos los pedidos
- Cambiar estado de pedidos
- Ver detalles completos
- Información del cliente

### Contactos
- Ver mensajes de clientes
- Marcar como leído
- Responder consultas

## 🛒 Proceso de Compra

1. **Navegación** por productos con filtros
2. **Agregar al carrito** productos
3. **Revisar carrito** y cantidades
4. **Checkout** con datos de envío
5. **Confirmación** de pedido
6. **Seguimiento** del estado

## 📱 Responsive Design

- **Desktop:** Navegación completa, grid de 4 columnas
- **Tablet:** Navegación adaptada, grid de 3 columnas
- **Mobile:** Menú hamburguesa, grid de 1 columna

---

**Desarrollado por WebXpert - Julio Pintos**  
**Todos los derechos reservados de WebXpert** 