import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import './ProductsList.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addToCartSuccess, setAddToCartSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const { addToCart } = useCart();
  const { favoriteProductIds, addFavoriteProduct, removeFavoriteProduct, isFavoriteProduct } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      if (response.data.success) {
        setProducts(response.data.products);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        throw new Error(response.data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories. Please try again later.');
    }
  };

  const filteredProducts = (selectedCategory === 'all'
    ? products
    : products.filter(product => product.category._id === selectedCategory)
  ).filter(product =>
    product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.src = '/default-product.jpg';
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddToCartSuccess(`${product.name} added to cart!`);
    setTimeout(() => setAddToCartSuccess(''), 2000);
  };

  const toggleFavorite = (productId) => {
    if (isFavoriteProduct(productId)) {
      removeFavoriteProduct(productId);
    } else {
      addFavoriteProduct(productId);
    }
  };

  if (loading) {
    return <div className="products-container">Loading...</div>;
  }

  if (error) {
    return <div className="products-container">Error: {error}</div>;
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Explore our selection of quality pet products, including healthy food, fun toys, cozy beds, and must-have accessories. Everything your pet needs to stay happy, active, and well cared for!</p>
      </div>

      <div style={{ marginBottom: '1.5rem', maxWidth: 350 }}>
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem 1rem',
            borderRadius: '25px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            outline: 'none',
            marginBottom: '0.5rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {addToCartSuccess && (
        <div style={{
          position: 'fixed',
          top: '80px', // Position below navbar
          right: '20px',
          background: 'var(--primary-red)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000,
          animation: 'slideIn 0.5s ease-out',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {addToCartSuccess}
        </div>
      )}

      <div className="filter-buttons">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Products
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image-container">
              <img
                src={
                  product.image
                    ? (product.image.startsWith('http')
                      ? product.image
                      : `http://localhost:4000${product.image}`)
                    : '/default-product.jpg'
                }
                alt={product.name}
                className="product-image"
                onError={handleImageError}
              />
              {(!user || user.role !== 1) && (
                <button
                  className={`favorite-btn ${isFavoriteProduct(product._id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(product._id)}
                  aria-label={isFavoriteProduct(product._id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FaHeart />
                </button>
              )}
            </div>
            <div className="product-info">
              <div>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">{product.price} EGP</div>
              </div>
              {(!user || user.role !== 1) && (
                <button
                  className="product-add-btn"
                  onClick={() => handleAddToCart(product)}
                  aria-label="Add to cart"
                >
                  <FaShoppingCart />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList; 
