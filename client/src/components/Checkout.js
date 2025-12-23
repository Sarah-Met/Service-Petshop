import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axiosInstance from '../utils/axiosConfig';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreementFile, setAgreementFile] = useState(null);
  const [signature, setSignature] = useState('');
  const [agreementUploaded, setAgreementUploaded] = useState(false);
  const [user, setUser] = useState(null);

  const hasPet = cartItems.some(item => item.type === 'pet');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axiosInstance.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        // fallback to localStorage if fetch fails
        const localUser = localStorage.getItem('user');
        if (localUser) setUser(JSON.parse(localUser));
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (hasPet) {
      if (!agreementFile) {
        setError('Please upload the Pet Adoption Agreement.');
        setLoading(false);
        return;
      }
      if (!signature.trim()) {
        setError('Please sign your name.');
        setLoading(false);
        return;
      }
      if (!user) {
        setError('User information not loaded. Please refresh and try again.');
        setLoading(false);
        return;
      }
      // Validate signature matches user's first and last name
      const expectedName = `${user.firstName} ${user.lastName}`.replace(/\s+/g, ' ').trim().toLowerCase();
      const enteredName = signature.replace(/\s+/g, ' ').trim().toLowerCase();
      if (enteredName !== expectedName) {
        setError('Signature must match your first and last name as on your profile.');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to complete your purchase');
      }

      // Create order using FormData
      const formData = new FormData();
      formData.append('products', JSON.stringify(cartItems.map(item => ({
        product: item._id,
        kind: item.type === 'pet' ? 'Pet' : 'Product',
        quantity: item.quantity,
        price: item.price
      }))));
      formData.append('totalAmount', getCartTotal());
      if (hasPet) {
        formData.append('adoptionAgreement', agreementFile);
        formData.append('adoptionSignature', signature);
      }

      const response = await axiosInstance.post('/orders', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        clearCart();
        localStorage.setItem('orderCompleted', 'true');
        navigate('/success');
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-message">
        <h2>Your cart is empty</h2>
        <p>Please add items to your cart before proceeding to checkout.</p>
        <button onClick={() => navigate('/products')} className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="order-summary" style={{ width: '100%', maxWidth: 500 }}>
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item._id} className="checkout-item">
              <img
                src={item.image && item.image.startsWith('http') ? item.image : `http://localhost:4000${item.image}`}
                alt={item.name}
                onError={(e) => {
                  e.target.src = '/default-product.jpg';
                }}
              />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {item.price} EGP</p>
              </div>
              <div className="item-total">
                {(item.price * item.quantity).toFixed(2)} EGP
              </div>
            </div>
          ))}
          <div className="order-total">
            <span>Total:</span>
            <span>{getCartTotal().toFixed(2)} EGP</span>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 500, marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {hasPet && (
            <div className="adoption-agreement-section" style={{ width: '100%', marginBottom: '1.5rem' }}>
              <div style={{
                background: '#fff',
                color: 'var(--primary-red)',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1rem',
                fontWeight: 600,
                fontSize: '1rem',
                textAlign: 'left'
              }}>
                <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Important:</span> By signing the agreement, adopters commit to providing lifelong care, proper shelter, medical attention, and compassion. It protects the pet's well-being and helps us match animals with families who are truly ready to welcome them.
              </div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Upload Pet Adoption Agreement (required):</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={e => {
                  setAgreementFile(e.target.files[0]);
                  setAgreementUploaded(true);
                }}
                style={{ marginBottom: 12 }}
              />
              {agreementUploaded && (
                <div style={{ marginTop: 8 }}>
                  <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Sign your name (first and last):</label>
                  <input
                    type="text"
                    value={signature}
                    onChange={e => setSignature(e.target.value)}
                    placeholder="Type your full name as signature"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ddd' }}
                  />
                </div>
              )}
            </div>
          )}
          <p className="checkout-notice" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            By clicking "Place Order", you agree to our terms and conditions. <br />
            Our admin team will review your order and contact you shortly.
          </p>
          {error && <div className="error-message" style={{ width: '100%', textAlign: 'center' }}>{error}</div>}
          <button
            onClick={handleSubmit}
            className="place-order-btn"
            disabled={loading || (hasPet && (!agreementFile || !signature.trim()))}
            style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 
