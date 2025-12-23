import React, { useState, useEffect } from 'react';
import './PetsList.css';
import { FaHeart, FaPaw } from 'react-icons/fa';
import axios from 'axios';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

const PetsList = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [clickedAdopt, setClickedAdopt] = useState(null);
  const [tempAdopted, setTempAdopted] = useState(null);
  const [pets, setPets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addToCartSuccess, setAddToCartSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const { favoritePetIds, addFavoritePet, removeFavoritePet, isFavoritePet } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/pets');
        if (response.data.success) {
          setPets(response.data.pets);
          console.log('Fetched pets:', response.data.pets);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pets');
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/categories');
        if (response.data.success) {
          setCategories(response.data.categories);
          console.log('Fetched categories:', response.data.categories);
        }
      } catch (err) {
        // ignore category fetch error for now
      }
    };
    fetchPets();
    fetchCategories();
  }, []);

  // Show all categories as filter buttons
  const petCategories = categories;

  const toggleFavorite = (petId) => {
    if (isFavoritePet(petId)) {
      removeFavoritePet(petId);
    } else {
      addFavoritePet(petId);
    }
  };

  const handleAddToCart = (pet) => {
    addToCart(pet, 'pet');
    setClickedAdopt(pet._id);
    setTempAdopted(pet._id);
    setAddToCartSuccess(`${pet.name} added to cart!`);
    setTimeout(() => setClickedAdopt(null), 1000);
    setTimeout(() => setTempAdopted(null), 2000);
    setTimeout(() => setAddToCartSuccess(''), 2000);
  };

  const filteredPets = activeFilter === 'all'
    ? pets
    : pets.filter(pet => pet.category && pet.category.name === activeFilter);

  if (loading) return <div className="pets-container"><h2>Loading pets...</h2></div>;
  if (error) return <div className="pets-container"><h2>{error}</h2></div>;

  return (
    <div className="pets-container">
      <div className="pets-header">
        <h1>Our Pets</h1>
        <p>Meet our featured furry friends who are looking for their forever homes. Each one has a unique personality and lots of love to give!</p>
      </div>

      <div style={{ marginBottom: '1.5rem', maxWidth: 350 }}>
        <input
          type="text"
          placeholder="Search pets by name..."
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
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Pets
        </button>
        {petCategories.map(category => (
          <button
            key={category._id}
            className={`filter-btn ${activeFilter === category._id ? 'active' : ''}`}
            onClick={() => setActiveFilter(category._id)}
          >
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </button>
        ))}
      </div>

      {/* Wrap pets-grid in a wrapper for better alignment */}
      <div className="pets-grid-wrapper">
        <div className="pets-grid">
          {(activeFilter === 'all' ? pets : pets.filter(pet => {
            if (!pet.category) return false;
            if (typeof pet.category === 'object' && pet.category._id) {
              return pet.category._id === activeFilter;
            }
            return pet.category === activeFilter;
          }))
            .filter(pet => pet.name && pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(pet => (
              <div key={pet._id} className="pet-card">
                <button
                  className={`favorite-btn ${isFavoritePet(pet._id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(pet._id)}
                  aria-label={isFavoritePet(pet._id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FaHeart />
                </button>
                <div className="pet-image-container">
                  <img
                    src={`http://localhost:4000${pet.image}`}
                    alt={pet.name}
                    className="pet-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Pet+Image';
                    }}
                  />
                </div>
                <div className="pet-info-wrapper">
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p className="pet-breed">{pet.breed}</p>
                    <p className="pet-age">Age: {pet.age} {pet.ageUnit ? pet.ageUnit : 'years'}</p>
                    <div className="pet-characteristics">
                      {pet.characteristics.map((trait, index) => (
                        <span key={index} className="characteristic-tag">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                  {(!user || user.role !== 1) && (
                    <button
                      className={`adopt-btn ${clickedAdopt === pet._id ? 'clicked' : ''} ${tempAdopted === pet._id ? 'temp-adopted' : ''}`}
                      onClick={() => handleAddToCart(pet)}
                      aria-label="Adopt this pet"
                    >
                      <FaPaw />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PetsList;  
