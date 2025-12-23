import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSpinner, FaImage } from 'react-icons/fa';

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedPet, setEditedPet] = useState({
    name: '',
    breed: '',
    age: '',
    ageUnit: 'years',
    price: '',
    characteristics: '',
    image: 'default-pet.jpg',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const inputStyle = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '4px 8px',
    width: '100%',
    minWidth: '80px'
  };

  useEffect(() => {
    fetchPets();
    fetchCategories();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/pets');
      if (response.data.success) {
        setPets(response.data.pets);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch pets');
      }
    } catch (err) {
      setError('Failed to fetch pets');
      console.error('Fetch pets error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleAdd = () => {
    setEditingId('new');
    setEditedPet({
      name: '',
      breed: '',
      age: '',
      ageUnit: 'years',
      price: '',
      characteristics: '',
      image: 'default-pet.jpg',
      category: ''
    });
    setError('');
    setSuccess('');
  };

  const handleEdit = (pet) => {
    setEditingId(pet._id);
    setEditedPet({
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      ageUnit: pet.ageUnit || 'years',
      price: pet.price || '',
      characteristics: Array.isArray(pet.characteristics) ? pet.characteristics.join(', ') : pet.characteristics,
      image: pet.image || 'default-pet.jpg',
      category: pet.category && pet.category._id ? pet.category._id : pet.category || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validate required fields
      const requiredFields = ['name', 'breed', 'age', 'ageUnit', 'characteristics', 'category'];
      const missingFields = requiredFields.filter(field => !editedPet[field]);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate numeric fields
      const age = editedPet.age;
      const price = editedPet.price || 0;
      const characteristics = editedPet.characteristics;

      if (!age || isNaN(age) || age < 0) {
        throw new Error('Age must be a positive number');
      }

      if (price !== undefined && price !== null && (isNaN(price) || price < 0)) {
        throw new Error('Price must be a non-negative number');
      }

      if (!characteristics || characteristics.length === 0) {
        throw new Error('At least one characteristic is required');
      }

      // Convert characteristics to array
      const characteristicsArray = characteristics
        .split(',')
        .map(char => char.trim())
        .filter(char => char.length > 0);

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('name', editedPet.name.trim());
      formData.append('breed', editedPet.breed.trim());
      formData.append('age', Number(editedPet.age));
      formData.append('ageUnit', editedPet.ageUnit);
      formData.append('price', Number(price));
      formData.append('category', editedPet.category);
      characteristicsArray.forEach(char => formData.append('characteristics', char));

      // Handle image upload
      if (editedPet.image instanceof File) {
        // If it's a new file upload
        formData.append('image', editedPet.image);
      } else if (editedPet.image && editedPet.image !== 'default-pet.jpg') {
        // If it's an existing image path, don't modify it
        formData.append('image', editedPet.image);
      }

      console.log('Sending pet data:', {
        name: editedPet.name.trim(),
        breed: editedPet.breed.trim(),
        age: Number(editedPet.age),
        ageUnit: editedPet.ageUnit,
        price: Number(price),
        category: editedPet.category,
        characteristics,
        hasImage: editedPet.image instanceof File || (editedPet.image && editedPet.image !== 'default-pet.jpg')
      });

      let response;
      if (editingId === 'new') {
        response = await axiosInstance.post('/pets', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data.success) {
          setSuccess('Pet created successfully!');
          await fetchPets();
        } else {
          throw new Error(response.data.message || 'Failed to create pet');
        }
      } else {
        response = await axiosInstance.put(`/pets/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data.success) {
          setSuccess('Pet updated successfully!');
          await fetchPets();
        } else {
          throw new Error(response.data.message || 'Failed to update pet');
        }
      }

      // Reset form
      setEditingId(null);
      setEditedPet({
        name: '',
        breed: '',
        age: '',
        ageUnit: 'years',
        price: '',
        characteristics: '',
        image: 'default-pet.jpg',
        category: ''
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 4000);

    } catch (err) {
      console.error('Save error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      // Show all backend validation details if available
      if (err.response?.data?.details) {
        setError(err.response.data.details.join(', '));
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || 'Failed to save pet');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedPet({
      name: '',
      breed: '',
      age: '',
      ageUnit: 'years',
      price: '',
      characteristics: '',
      image: 'default-pet.jpg',
      category: ''
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setEditedPet(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setEditedPet(prev => ({
        ...prev,
        [name]: name === 'age' ? Number(value) : name === 'price' ? Number(value) : value
      }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        setLoading(true);
        setError('');
        setSuccess('');

        const response = await axiosInstance.delete(`/pets/${id}`);
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to delete pet');
        }

        setSuccess('Pet deleted successfully!');
        await fetchPets();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);

      } catch (err) {
        setError(err.message || 'Failed to delete pet');
        console.error('Delete error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper to get full image URL
  const getPetImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/64x64?text=No+Image';
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
        <h2 className="panel-title">Manage Pets</h2>
        <button className="action-button" onClick={handleAdd}>
          <FaPlus />
          Add New Pet
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Breed</th>
            <th>Age</th>
            <th>Price</th>
            <th>Category</th>
            <th>Characteristics</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {editingId === 'new' && (
            <tr>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                    {editedPet.image && editedPet.image !== 'default-pet.jpg' ? (
                      <img src={editedPet.image} alt="Pet preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaImage style={{ color: '#9ca3af' }} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ fontSize: '0.875rem' }}
                    disabled={loading}
                  />
                </div>
              </td>
              <td>
                <input
                  type="text"
                  name="name"
                  value={editedPet.name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Pet Name"
                  required
                  disabled={loading}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="breed"
                  value={editedPet.breed}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Breed"
                  required
                  disabled={loading}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="age"
                  value={editedPet.age}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Age"
                  min="0"
                  required
                  disabled={loading}
                />
                <select
                  name="ageUnit"
                  value={editedPet.ageUnit}
                  onChange={handleChange}
                  style={{ ...inputStyle, marginTop: '0.3rem' }}
                  required
                  disabled={loading}
                >
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  name="price"
                  value={editedPet.price}
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
                <select
                  name="category"
                  value={editedPet.category}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  name="characteristics"
                  value={editedPet.characteristics}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Characteristics (comma-separated)"
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
          {pets.map(pet => (
            <tr key={pet._id}>
              <td>
                <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                  <img
                    src={getPetImageUrl(pet.image)}
                    alt={pet.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64x64?text=No+Image'; }}
                  />
                </div>
              </td>
              <td>
                {editingId === pet._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedPet.name}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={loading}
                  />
                ) : pet.name}
              </td>
              <td>
                {editingId === pet._id ? (
                  <input
                    type="text"
                    name="breed"
                    value={editedPet.breed}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={loading}
                  />
                ) : pet.breed}
              </td>
              <td>
                {editingId === pet._id ? (
                  <>
                    <input
                      type="number"
                      name="age"
                      value={editedPet.age}
                      onChange={handleChange}
                      style={inputStyle}
                      min="0"
                      required
                      disabled={loading}
                    />
                    <select
                      name="ageUnit"
                      value={editedPet.ageUnit}
                      onChange={handleChange}
                      style={{ ...inputStyle, marginTop: '0.3rem' }}
                      required
                      disabled={loading}
                    >
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </>
                ) : (
                  <span>{pet.age} {pet.ageUnit || 'years'}</span>
                )}
              </td>
              <td>
                {editingId === pet._id ? (
                  <input
                    type="number"
                    name="price"
                    value={editedPet.price}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
                    step="0.01"
                    required
                    disabled={loading}
                  />
                ) : pet.price !== undefined && pet.price !== null ? `${pet.price} EGP` : '0 EGP'}
              </td>
              <td>
                {editingId === pet._id ? (
                  <select
                    name="category"
                    value={editedPet.category}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : pet.category && pet.category.name ? pet.category.name : ''}
              </td>
              <td>
                {editingId === pet._id ? (
                  <input
                    type="text"
                    name="characteristics"
                    value={editedPet.characteristics}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={loading}
                  />
                ) : Array.isArray(pet.characteristics) ? pet.characteristics.join(', ') : pet.characteristics}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {editingId === pet._id ? (
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
                        onClick={() => handleEdit(pet)}
                        style={{ background: 'var(--accent-green)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(pet._id)}
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

export default ManagePets;
