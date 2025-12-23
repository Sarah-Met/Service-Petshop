import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { FaPaw, FaShoppingCart, FaLock, FaArrowRight, FaUser } from 'react-icons/fa';
import './App.css';
import heroDog from './images/hero-dog.png';
import PetsList from './components/PetsList';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Profile from './components/Profile';
import ProductsList from './components/ProductsList';
import Checkout from './components/Checkout';
import Success from './components/Success';
import { useCart } from './context/CartContext';
import AdminDashboard from './components/AdminDashboard';
import AdoptionProcess from './components/AdoptionProcess';

// Private Route component
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const user = getStoredUser();
  const token = localStorage.getItem('token');

  if (!user || !token) {
    // Redirect to login with the current location
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return children;
};

// Helper to get user from localStorage
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const Home = ({ user }) => (
  <>
    <main className="hero-section">
      <div className="hero-content" style={{ position: 'relative', paddingTop: user ? '8rem' : '0' }}>
        {user && (
          <h2 style={{
            color: 'var(--primary-red)',
            position: 'absolute',
            top: '2rem',
            left: 0,
            fontSize: '3.5rem',
            fontWeight: 700,
            fontFamily: 'Bebas Neue, Inter, Arial, sans-serif',
            letterSpacing: '1px',
            textAlign: 'left',
            lineHeight: 1.1,
            margin: 0,
            zIndex: 2
          }}>
            Welcome, {user.firstName} {user.lastName}!
          </h2>
        )}
        <h1 className="hero-title">
          FIND YOUR<br />
          FOREVER FRIEND <FaPaw />
        </h1>
        <p className="hero-description">
          Welcome to our adoption center, where every pet deserves a loving forever home. 
          Give a second chance to a furry friend today.
        </p>
        <div className="cta-section">
          <Link to="/pets" className="adopt-now-btn">ADOPT NOW</Link>
          <span className="learn-more" style={{cursor: 'pointer'}} onClick={() => {
            const el = document.getElementById('adoption-process');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            View Adoption Process <FaArrowRight />
          </span>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">2K+</span>
            <span className="stat-label">Happy Adoptions</span>
          </div>
        </div>
      </div>
      <div className="hero-image-section">
        <img 
          src={heroDog}
          alt="Adorable dog waiting for adoption"
          className="hero-image"
        />
      </div>
    </main>
    <AdoptionProcess />
  </>
);

function capitalizeName(name) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeout = useRef(null);
  const { cartItems, clearCart } = useCart();

  useEffect(() => {
    // Listen for login/logout changes from other tabs
    const onStorage = () => setUser(getStoredUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
      dropdownTimeout.current = null;
    }
    setDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300); // 0.3 second delay
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    clearCart();
    setUser(null);
    setDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/" className="nav-brand">
            <FaPaw /> El-Mammar
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/pets" className="nav-link">Our Pets</Link>
            <Link to="/products" className="nav-link">Our Products</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            {user && user.role !== 1 && (
              <Link to="/contact" className="nav-link">Make An Appointment</Link>
            )}
            {(!user || user.role !== 1) && (
              <Link to="/cart" className="nav-link cart-link" style={{ position: 'relative', marginRight: '1rem' }}>
                <FaShoppingCart size={22} />
                {cartItems.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'var(--primary-red)',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 7px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    zIndex: 2
                  }}>{cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}</span>
                )}
              </Link>
            )}
            {user ? (
              <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                <div
                  className="cart-btn login-btn profile-btn"
                  onClick={() => setDropdownOpen((open) => !open)}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
                >
                  <FaUser />
                </div>
                {dropdownOpen && (
                  <div className="profile-dropdown" onMouseEnter={handleDropdownMouseEnter} onMouseLeave={handleDropdownMouseLeave}>
                    <div
                      className="profile-dropdown-name"
                      style={{
                        fontSize: '1.3rem',
                        fontWeight: 700
                      }}
                    >
                      {capitalizeName(user.firstName)} {capitalizeName(user.lastName)}
                    </div>
                    {user.role === 1 && (
                      <Link
                        to="/admin"
                        className="profile-dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                        style={{ textDecoration: 'none', color: 'var(--primary-red)', fontWeight: 600 }}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="profile-dropdown-link"
                      onClick={() => setDropdownOpen(false)}
                      style={{ textDecoration: 'none' }}
                    >
                      View Profile
                    </Link>
                    <div className="profile-dropdown-link" onClick={handleSignOut}>Sign Out</div>
                  </div>
                )}
              </div>
            ) : (
            <Link to="/login" className="cart-btn login-btn">
              <FaUser /> LOGIN
            </Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/pets" element={<PetsList />} />
          <Route path="/success" element={
            <PrivateRoute>
              {user && user.role === 1 ? (
                <Navigate to="/admin" replace />
              ) : (
                localStorage.getItem('orderCompleted') ? (
                  <Success />
                ) : (
                  <Navigate to="/cart" replace />
                )
              )}
            </PrivateRoute>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={
            <PrivateRoute>
              {user && user.role === 1 ? (
                <Navigate to="/admin" replace />
              ) : (
                <Cart />
              )}
            </PrivateRoute>
          } />
          <Route path="/checkout" element={
            <PrivateRoute>
              {user && user.role === 1 ? (
                <Navigate to="/admin" replace />
              ) : (
                <Checkout />
              )}
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/products" element={<ProductsList />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
