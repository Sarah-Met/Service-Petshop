import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosConfig';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCategory, setEditedCategory] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // State for new category form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [pets, setPets] = useState([]);

  const inputStyle = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '4px 8px',
    width: '100%',
    minWidth: '80px'
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchPets();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await axiosInstance.get('/pets');
      if (response.data.success) {
        setPets(response.data.pets);
      }
    } catch (error) {
      // Optionally handle error
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setNewCategory({ name: '', description: '' });
    setError('');
  };

  const handleAddInputChange = (field, value) => {
    setNewCategory(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      setError('Name and description are required');
      return;
    }
    try {
      setLoading(true);
      const categoryToSend = {
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        itemCount: 0
      };
      const response = await axiosInstance.post('/categories', categoryToSend);
      if (response.data.success) {
        await fetchCategories();
        setShowAddForm(false);
        setNewCategory({ name: '', description: '' });
        setError('');
      } else {
        setError(response.data.message || 'Failed to add category');
      }
    } catch (error) {
      setError('Failed to add category');
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditedCategory({ ...category });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/categories/${editingId}`,
        editedCategory
      );
      if (response.data.success) {
        setCategories(categories.map(category => 
          category._id === editingId ? response.data.category : category
        ));
        setEditingId(null);
        setEditedCategory(null);
      }
    } catch (error) {
      setError('Failed to update category');
      console.error('Error updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedCategory(null);
  };

  const handleChange = (field, value) => {
    setEditedCategory(prev => ({
      ...prev,
      [field]: field === 'itemCount' ? Number(value) : value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setLoading(true);
        const response = await axiosInstance.delete(`/categories/${id}`);
        if (response.data.success) {
          setCategories(categories.filter(category => category._id !== id));
        }
      } catch (error) {
        setError('Failed to delete category');
        console.error('Error deleting category:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Show all categories
  const displayedCategories = categories;

  if (loading) {
    return <div className="admin-panel">Loading...</div>;
  }

  if (error) {
    return <div className="admin-panel">Error: {error}</div>;
  }

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2 className="panel-title">Manage Categories</h2>
        <button className="action-button" onClick={handleShowAddForm}>
          <FaPlus />
          Add New Category
        </button>
      </div>
      {showAddForm && (
        <form onSubmit={handleAdd} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={e => handleAddInputChange('name', e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newCategory.description}
            onChange={e => handleAddInputChange('description', e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" className="action-button" style={{ background: 'var(--accent-green)', color: 'white' }}>
            <FaSave /> Save
          </button>
          <button type="button" className="action-button" style={{ background: '#6c757d', color: 'white' }} onClick={() => setShowAddForm(false)}>
            <FaTimes /> Cancel
          </button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Pet Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedCategories.map(category => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>
                {editingId === category._id ? (
                  <input
                    type="text"
                    value={editedCategory.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    style={inputStyle}
                  />
                ) : category.name}
              </td>
              <td>
                {editingId === category._id ? (
                  <input
                    type="text"
                    value={editedCategory.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    style={inputStyle}
                  />
                ) : category.description}
              </td>
              <td>{pets.filter(pet => pet.category === category._id).length}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {editingId === category._id ? (
                    <>
                      <button
                        onClick={handleSave}
                        title="Save Changes"
                        style={{ background: 'var(--accent-green)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={handleCancel}
                        title="Cancel"
                        style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(category)}
                      title="Edit Category"
                      style={{ background: 'var(--accent-green)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(category._id)}
                    data-tooltip="Delete Category"
                    style={{ background: 'var(--primary-red)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
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
  );
};

export default ManageCategories;
