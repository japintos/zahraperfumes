import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './Admin.css';

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Datos de ejemplo para demo
  const products = [
    {
      id: 1,
      name: 'Chanel N°5',
      category: 'Mujer',
      price: 200.00,
      stock: 15,
      status: 'active',
      images: ['chanel-n5-1.jpg', 'chanel-n5-2.jpg']
    },
    {
      id: 2,
      name: 'Dior Sauvage',
      category: 'Hombre',
      price: 180.00,
      stock: 8,
      status: 'active',
      images: ['dior-sauvage-1.jpg']
    },
    {
      id: 3,
      name: 'Versace Eros',
      category: 'Hombre',
      price: 150.00,
      stock: 12,
      status: 'active',
      images: ['versace-eros-1.jpg', 'versace-eros-2.jpg']
    },
    {
      id: 4,
      name: 'Paco Rabanne 1 Million',
      category: 'Hombre',
      price: 160.00,
      stock: 5,
      status: 'active',
      images: ['paco-1million-1.jpg']
    },
    {
      id: 5,
      name: 'Marc Jacobs Daisy',
      category: 'Mujer',
      price: 120.00,
      stock: 20,
      status: 'active',
      images: ['marc-daisy-1.jpg', 'marc-daisy-2.jpg']
    }
  ];

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      console.log('Eliminar producto:', productId);
      // Aquí iría la lógica real de eliminación
    }
  };

  const handleSave = (productData) => {
    console.log('Guardar producto:', productData);
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestión de Productos</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Agregar Producto
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div className="product-image">
                    {product.images.length > 0 && (
                      <img 
                        src={`/uploads/${product.images[0]}`} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/img/placeholder.jpg';
                        }}
                      />
                    )}
                  </div>
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.status}`}>
                    {product.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleEdit(product)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product.id)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar/editar producto */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingProduct || {});
              }}>
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input 
                    type="text" 
                    defaultValue={editingProduct?.name || ''}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select defaultValue={editingProduct?.category || ''}>
                    <option value="">Seleccionar categoría</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Importado">Importado</option>
                    <option value="Imitación">Imitación</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input 
                    type="number" 
                    step="0.01"
                    defaultValue={editingProduct?.price || ''}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input 
                    type="number" 
                    defaultValue={editingProduct?.stock || ''}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea 
                    rows="4"
                    defaultValue={editingProduct?.description || ''}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Imágenes</label>
                  <input type="file" multiple accept="image/*" />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Actualizar' : 'Crear'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 