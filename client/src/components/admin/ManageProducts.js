import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSpinner, FaImage } from 'react-icons/fa';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: 'default-product.jpg',
    imageFile: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '4px 8px',
    width: '100%',
    minWidth: '80px'
  };

  useEffect(() => {
    fetchProducts();
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

  const handleAdd = () => {
    setEditingId('new');
    setEditedProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: 'default-product.jpg',
      imageFile: null
    });
    setError('');
    setSuccess('');
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditedProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image || 'default-product.jpg',
      imageFile: null
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      // Validate required fields
      const requiredFields = ['name', 'description', 'price', 'stock'];
      const missingFields = requiredFields.filter(field => !editedProduct[field]);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate numeric fields
      if (isNaN(editedProduct.price) || editedProduct.price < 0) {
        throw new Error('Price must be a positive number');
      }
      if (isNaN(editedProduct.stock) || editedProduct.stock < 0) {
        throw new Error('Stock must be a positive number');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('description', editedProduct.description);
      formData.append('price', editedProduct.price);
      formData.append('stock', editedProduct.stock);

      // Handle image file
      if (editedProduct.imageFile) {
        formData.append('image', editedProduct.imageFile);
      }

      console.log('Saving product with data:', {
        name: editedProduct.name,
        description: editedProduct.description,
        price: editedProduct.price,
        stock: editedProduct.stock,
        hasImage: !!editedProduct.imageFile
      });

      let response;
      if (editingId === 'new') {
        console.log('Creating new product...');
        response = await axiosInstance.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data.success) {
          setSuccess('Product created successfully!');
          setProducts(prevProducts => [response.data.product, ...prevProducts]);
        } else {
          throw new Error(response.data.message || 'Failed to create product');
        }
      } else {
        console.log('Updating existing product...');
        response = await axiosInstance.put(`/products/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data.success) {
          setSuccess('Product updated successfully!');
          setProducts(prevProducts =>
            prevProducts.map(p => p._id === editingId ? response.data.product : p)
          );
        } else {
          throw new Error(response.data.message || 'Failed to update product');
        }
      }

      // Reset form
      setEditingId(null);
      setEditedProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: 'default-product.jpg',
        imageFile: null
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('Save error:', err);
      if (err.response?.status === 401) {
        setError('Please log in to continue');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(err.message || 'Failed to save product');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: 'default-product.jpg',
      imageFile: null
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProduct(prev => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file)
      }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        setError('');
        setSuccess('');

        const response = await axiosInstance.delete(`/products/${id}`);
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to delete product');
        }

        setSuccess('Product deleted successfully!');
        await fetchProducts();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);

      } catch (err) {
        setError(err.message || 'Failed to delete product');
        console.error('Delete error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper to get full image URL
  const getProductImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/40x40?text=No+Image';
    if (image.startsWith('http')) return image;
    return `http://localhost:4000${image}`;
  };

  if (loading) {
    return <div className="admin-panel">Loading...</div>;
  }

  if (error) {
    return <div className="admin-panel">Error: {error}</div>;
  }

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2 className="panel-title">Manage Products</h2>
        <button className="action-button" onClick={handleAdd}>
          <FaPlus />
          Add New Product
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {editingId === 'new' && (
            <tr>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                    {editedProduct.image && editedProduct.image !== 'default-product.jpg' ? (
                      <img
                        src={editedProduct.image}
                        alt="Product preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaImage style={{ color: '#9ca3af' }} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ fontSize: '0.875rem' }}
                    disabled={loading}
                  />
                </div>
              </td>
              <td>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Product Name"
                  required
                  disabled={loading}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="description"
                  value={editedProduct.description}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Description"
                  required
                  disabled={loading}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="stock"
                  value={editedProduct.stock}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Stock"
                  min="0"
                  required
                  disabled={loading}
                />
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{ background: 'var(--accent-green)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </td>
            </tr>
          )}
          {products.map(product => (
            <tr key={product._id}>
              <td>
                <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                  <img
                    src={getProductImageUrl(product.image)}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64x64?text=No+Image'; }}
                  />
                </div>
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={loading}
                  />
                ) : product.name}
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    name="description"
                    value={editedProduct.description}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={loading}
                  />
                ) : product.description}
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
                    step="0.01"
                    required
                    disabled={loading}
                  />
                ) : `${product.price} EGP`}
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    type="number"
                    name="stock"
                    value={editedProduct.stock}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
                    required
                    disabled={loading}
                  />
                ) : product.stock}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {editingId === product._id ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        style={{ background: 'var(--accent-green)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      </button>
                      <button
                        onClick={handleCancel}
                        style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(product)}
                        style={{ background: 'var(--accent-green)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        style={{ background: 'var(--primary-red)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
