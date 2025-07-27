#!/bin/bash

echo "🚀 Instalando Sahra Perfumes Ecommerce..."
echo "=========================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor, instala Node.js v16 o superior."
    exit 1
fi

# Verificar si MySQL está instalado
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL no está instalado. Por favor, instala MySQL v8.0 o superior."
    exit 1
fi

echo "✅ Node.js y MySQL están instalados"

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    echo "✅ Archivo .env creado. Por favor, edítalo con tus configuraciones."
fi

# Crear carpeta uploads si no existe
if [ ! -d uploads ]; then
    echo "📁 Creando carpeta uploads..."
    mkdir uploads
    echo "✅ Carpeta uploads creada"
fi

# Instalar dependencias del servidor
echo "📦 Instalando dependencias del servidor..."
npm install

# Instalar dependencias del cliente
echo "📦 Instalando dependencias del cliente..."
cd client
npm install
cd ..

echo ""
echo "🎉 Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita el archivo .env con tus configuraciones de base de datos"
echo "2. Ejecuta el script de base de datos: mysql -u root -p < server/config/init-db.sql"
echo "3. Inicia el proyecto: npm run dev"
echo ""
echo "🔗 URLs de acceso:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:5000"
echo "- Admin: http://localhost:3000/admin"
echo ""
echo "👤 Credenciales de admin:"
echo "- Email: admin@sahraperfumes.com"
echo "- Password: admin123"
echo ""
echo "¡Disfruta tu nuevo ecommerce de perfumes! 🛍️" 