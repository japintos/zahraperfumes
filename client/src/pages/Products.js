import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaSort, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'name',
    order: searchParams.get('order') || 'ASC'
  });

  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Obtener productos
  const { data: productsData, isLoading, error } = useQuery(
    ['products', filters, page],
    async () => {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...filters
      });
      const response = await axios.get(`/api/products?${params}`);
      return response.data;
    }
  );

  // Obtener categorías
  const { data: categories } = useQuery('categories', async () => {
    const response = await axios.get('/api/products/categories/all');
    return response.data.categories;
  });

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      gender: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: 'name',
      order: 'ASC'
    });
    setPage(1);
  };

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>Error al cargar productos</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <h1>Nuestros Productos</h1>
          <p>Descubre nuestra amplia colección de fragancias</p>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-header">
            <button 
              className="btn btn-outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              Filtros
            </button>
            <button 
              className="btn btn-outline"
              onClick={clearFilters}
            >
              Limpiar Filtros
            </button>
          </div>

          {showFilters && (
            <div className="filters-container">
              <div className="filters-grid">
                {/* Búsqueda */}
                <div className="filter-group">
                  <label className="filter-label">Buscar</label>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="form-input"
                    />
                    <FaSearch className="search-icon" />
                  </div>
                </div>

                {/* Categoría */}
                <div className="filter-group">
                  <label className="filter-label">Categoría</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todas las categorías</option>
                    {categories?.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Género */}
                <div className="filter-group">
                  <label className="filter-label">Género</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todos</option>
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                {/* Tipo */}
                <div className="filter-group">
                  <label className="filter-label">Tipo</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todos</option>
                    <option value="original">Original</option>
                    <option value="importado">Importado</option>
                    <option value="imitacion">Imitación</option>
                  </select>
                </div>

                {/* Precio mínimo */}
                <div className="filter-group">
                  <label className="filter-label">Precio mínimo</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Precio máximo */}
                <div className="filter-group">
                  <label className="filter-label">Precio máximo</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Ordenamiento */}
                <div className="filter-group">
                  <label className="filter-label">Ordenar por</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="filter-select"
                  >
                    <option value="name">Nombre</option>
                    <option value="price">Precio</option>
                    <option value="created_at">Más recientes</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Orden</label>
                  <select
                    value={filters.order}
                    onChange={(e) => handleFilterChange('order', e.target.value)}
                    className="filter-select"
                  >
                    <option value="ASC">Ascendente</option>
                    <option value="DESC">Descendente</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="products-results">
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>
                  Mostrando {productsData?.products?.length || 0} de {productsData?.pagination?.total || 0} productos
                </p>
              </div>

              {productsData?.products?.length === 0 ? (
                <div className="no-products">
                  <h3>No se encontraron productos</h3>
                  <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
              ) : (
                <>
                  <div className="products-grid">
                    {productsData?.products?.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>

                  {/* Paginación */}
                  {productsData?.pagination?.pages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-button"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        Anterior
                      </button>
                      
                      {Array.from({ length: productsData.pagination.pages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          className={`pagination-button ${pageNum === page ? 'active' : ''}`}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                      
                      <button
                        className="pagination-button"
                        disabled={page === productsData.pagination.pages}
                        onClick={() => setPage(page + 1)}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente ProductCard
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image1 ? `/uploads/${product.image1}` : '/img/placeholder.jpg'}
          alt={product.name}
          className="product-image"
        />
        <button
          onClick={() => onAddToCart(product)}
          className="add-to-cart-btn"
          title="Agregar al carrito"
        >
          <FaShoppingCart />
        </button>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category_name}</p>
        <p className="product-description">{product.description}</p>
        
        <div className="product-badges">
          <span className={`badge badge-${product.gender}`}>
            {product.gender}
          </span>
          <span className={`badge badge-${product.type}`}>
            {product.type}
          </span>
        </div>
        
        <div className="product-price">
          <span className="price">${product.price.toFixed(2)}</span>
          {product.stock > 0 ? (
            <span className="stock in-stock">En stock</span>
          ) : (
            <span className="stock out-of-stock">Agotado</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products; 