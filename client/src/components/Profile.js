import React, { useState, useEffect } from 'react';
import { FaHeart, FaShoppingBag, FaUser, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import './Profile.css';
import { useFavorites } from '../context/FavoritesContext';
import { Link, useLocation } from 'react-router-dom';

const getTabFromQuery = (search) => {
  const params = new URLSearchParams(search);
  const tab = params.get('tab');
  if (tab === 'orders' || tab === 'favorites' || tab === 'appointments' || tab === 'profile') {
    return tab;
  }
  return 'profile';
};

const Profile = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(getTabFromQuery(location.search));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [orders, setOrders] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user, phoneNumber: user.phoneNumber || user.phone });
  const { favoritePetIds, favoriteProductIds } = useFavorites();
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [orderDetailsModal, setOrderDetailsModal] = useState({ open: false, order: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, productsRes] = await Promise.all([
          axiosInstance.get('/pets'),
          axiosInstance.get('/products')
        ]);

        if (petsRes.data.success) setAllPets(petsRes.data.pets);
        if (productsRes.data.success) setAllProducts(productsRes.data.products);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const endpoint = '/appointments';
        const res = await axiosInstance.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setAppointments(res.data.appointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();

    const fetchOrders = async () => {
      if (activeTab !== 'orders') return;
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axiosInstance.get('/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [activeTab, user]);

  // Update activeTab if URL changes
  useEffect(() => {
    setActiveTab(getTabFromQuery(location.search));
  }, [location.search]);

  const favoritePets = allPets.filter(pet => favoritePetIds.includes(pet._id));
  const favoriteProducts = allProducts.filter(product => favoriteProductIds.includes(product._id));

  const userId = user._id || user.id;

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    try {
      const response = await axiosInstance.put(`/users/${userId}`, editedUser);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsEditing(false);
        setEditSuccess('Profile updated successfully!');
      } else {
        setEditError(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      setEditError(error.response?.data?.message || 'Error updating user');
      console.error('Error updating user:', error);
    }
  };

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hour, minute] = time24.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h.toString().padStart(2, '0')}:${minute} ${ampm}`;
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setDeleteLoading(appointmentId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axiosInstance.delete(`/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.data.success) {
        // Remove the deleted appointment from the state
        setAppointments(prevAppointments =>
          prevAppointments.filter(appt => appt._id !== appointmentId)
        );
      } else {
        throw new Error(res.data.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert(error.response?.data?.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Helper to get full image URL for pets and products
  const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/300x200?text=Image';
    if (image.startsWith('http')) return image;
    return `http://localhost:4000${image}`;
  };

  const handleViewOrderDetails = async (order) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      // Fetch the latest order data
      const res = await axiosInstance.get(`/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const updatedOrder = res.data.orders.find(o => o._id === order._id);
        setOrderDetailsModal({ open: true, order: updatedOrder || order });
      } else {
        setOrderDetailsModal({ open: true, order });
      }
    } catch (error) {
      setOrderDetailsModal({ open: true, order });
    }
  };

  const renderProfileInfo = () => (
    <div className="profile-info">
      {!isEditing ? (
        <>
          <div className="profile-header">
            <h2>Profile Information</h2>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>First Name:</label>
              <span>{user.firstName}</span>
            </div>
            <div className="info-item">
              <label>Last Name:</label>
              <span>{user.lastName}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{user.phoneNumber || 'Not provided'}</span>
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <h2>Edit Profile</h2>
          {editError && <div style={{ color: 'red', marginBottom: '1rem' }}>{editError}</div>}
          {editSuccess && <div style={{ color: 'green', marginBottom: '1rem' }}>{editSuccess}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={editedUser.firstName}
                onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={editedUser.lastName}
                onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                value={editedUser.phoneNumber || ''}
                onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="orders-section">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-data">No orders yet</p>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-6)}</span>
                <span className={`order-status status-${order.status}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}, {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Total: {(order.totalAmount || 0).toLocaleString()} EGP</p>
                <p>Items: {order.products.length}</p>
                <button
                  className="view-details-btn"
                  style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--primary-red)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => handleViewOrderDetails(order)}
                >
                  View Details
                </button>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  {order.status === 'pending' && (
                    <button
                      style={{ padding: '0.5rem 1rem', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      onClick={async () => {
                        if (!window.confirm('Cancel this order?')) return;
                        try {
                          const token = localStorage.getItem('token');
                          await axiosInstance.put(`/orders/${order._id}`, { status: 'cancelled' }, { headers: { Authorization: `Bearer ${token}` } });
                          setOrders(prev => prev.map(o => o._id === order._id ? { ...o, status: 'cancelled' } : o));
                        } catch (err) {
                          alert('Failed to cancel order');
                        }
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                  {(order.status === 'cancelled' || order.status === 'delivered') && (
                    <button
                      style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      onClick={async () => {
                        if (!window.confirm('Delete this order from history?')) return;
                        try {
                          const token = localStorage.getItem('token');
                          await axiosInstance.delete(`/orders/${order._id}`, { headers: { Authorization: `Bearer ${token}` } });
                          setOrders(prev => prev.filter(o => o._id !== order._id));
                        } catch (err) {
                          alert('Failed to delete order');
                        }
                      }}
                    >
                      Delete Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Order Details Modal */}
      {orderDetailsModal.open && orderDetailsModal.order && (
        <div className="order-details-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 8, padding: '2rem', minWidth: 320, maxWidth: 400, boxShadow: '0 2px 12px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => setOrderDetailsModal({ open: false, order: null })} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
            <h3 style={{ marginBottom: '1rem' }}>Order Details</h3>
            <p><strong>Order ID:</strong> {orderDetailsModal.order._id}</p>
            <p><strong>Date:</strong> {new Date(orderDetailsModal.order.createdAt).toLocaleDateString()}, {new Date(orderDetailsModal.order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Status:</strong> {orderDetailsModal.order.status}</p>
            <p><strong>Total:</strong> {(orderDetailsModal.order.totalAmount || 0).toLocaleString()} EGP</p>
            {orderDetailsModal.order.products?.some(i => i.kind === 'Pet') && orderDetailsModal.order.adoptionAgreement && (
              <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                <p style={{ marginBottom: '1.25rem', marginTop: 0, fontWeight: 600 }}><strong>Adoption Agreement:</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', width: '100%' }}>
                  <button
                    style={{
                      background: 'var(--primary-red)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '0.6rem 0',
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      cursor: 'pointer',
                      width: '180px',
                      minWidth: '140px',
                      height: '48px',
                      transition: 'background 0.2s',
                      textAlign: 'center',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#d32f2f'}
                    onMouseOut={e => e.currentTarget.style.background = 'var(--primary-red)'}
                    onClick={() => window.open(`http://localhost:4000${orderDetailsModal.order.adoptionAgreement}`, '_blank')}
                  >
                    View Agreement
                  </button>
                  {orderDetailsModal.order.agreementStatus && (
                    <span style={{
                      padding: '0.6rem 0',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: '1rem',
                      width: '180px',
                      minWidth: '140px',
                      height: '48px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: orderDetailsModal.order.agreementStatus === 'accepted' || orderDetailsModal.order.agreementStatus === 'rejected' ? 'transparent' : '#ffc107',
                      color: orderDetailsModal.order.agreementStatus === 'accepted' ? '#28a745' : orderDetailsModal.order.agreementStatus === 'rejected' ? '#dc3545' : 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      textAlign: 'center'
                    }}>
                      Agreement {orderDetailsModal.order.agreementStatus.charAt(0).toUpperCase() + orderDetailsModal.order.agreementStatus.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            )}
            <h4 style={{ marginTop: '1rem' }}>Items:</h4>
            <ul style={{ paddingLeft: 18 }}>
              {orderDetailsModal.order.products?.map((item, idx) => {
                console.log('Full order item:', JSON.stringify(item, null, 2));
                return (
                  <li key={idx} style={{ marginBottom: 6 }}>
                    <strong>{item.product?.name || 'Product'}</strong>
                    {item.kind === 'Product' && item.product?.price && (
                      <> — {item.product.price} EGP</>
                    )}
                    <span> &times; {item.quantity}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="favorites-section">
      {favoritePets.length > 0 && (
        <>
          <h2 style={{ color: 'var(--primary-red)' }}>Favorite Pets</h2>
          <div className="pets-grid-4col">
            {favoritePets.map(pet => (
              <div key={pet._id} className="pet-card-4col">
                <div className="pet-image-container-4col">
                  <img
                    src={getImageUrl(pet.image)}
                    alt={pet.name}
                    className="pet-image-4col"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Pet+Image';
                    }}
                  />
                </div>
                <div className="pet-info-wrapper">
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p className="pet-breed">{pet.breed}</p>
                    {pet.characteristics && (
                      <div className="pet-characteristics">
                        {pet.characteristics.map((trait, idx) => (
                          <span key={idx} className="characteristic-tag">
                            {trait}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {favoriteProducts.length > 0 && (
        <>
          <h2 style={{ color: 'var(--primary-red)', marginTop: '2rem' }}>Favorite Products</h2>
          <div className="products-grid-4col">
            {favoriteProducts.map(product => (
              <div key={product._id} className="product-card-4col">
                <div className="product-image-container-4col">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="product-image-4col"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                    }}
                  />
                </div>
                <div className="product-info-wrapper">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">{product.price} EGP</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {favoritePets.length === 0 && favoriteProducts.length === 0 && (
        <p className="no-data">No favorites yet</p>
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className="appointments-section">
      <div className="section-header">
        <h2>My Appointments</h2>
        <Link to="/contact" className="make-appointment-btn">
          <FaCalendarAlt /> Make New Appointment
        </Link>
      </div>
      {appointments.length === 0 ? (
        <div className="no-data">
          <div className="no-data-icon">
            <FaCalendarAlt />
          </div>
          <p>You haven't made any appointments yet.</p>
          <Link to="/contact" className="make-appointment-btn">
            Schedule Your First Appointment
          </Link>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appt) => (
            <div key={appt._id} className="appointment-card">
              <div className="appointment-info">
                <div className="appointment-date">
                  <strong>Date & Time</strong>
                  <p>{new Date(appt.date).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div className="appointment-status">
                  <strong>Status</strong>
                  <p className={`status-badge status-${appt.status}`}>
                    {appt.status === 'confirmed' ? 'Approved' : appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </p>
                </div>
                {appt.pet && (
                  <div className="appointment-pet">
                    <strong>Pet</strong>
                    <p>{appt.pet.name} ({appt.pet.type})</p>
                  </div>
                )}
                {appt.notes && (
                  <div className="appointment-notes">
                    <strong>Description</strong>
                    <p>{appt.notes}</p>
                  </div>
                )}
              </div>
              {appt.status === 'pending' && (
                <div className="appointment-actions">
                  <button
                    className="cancel-appointment-btn"
                    onClick={() => handleDeleteAppointment(appt._id)}
                    disabled={deleteLoading === appt._id}
                  >
                    {deleteLoading === appt._id ? 'Cancelling...' : 'Cancel Appointment'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            <FaUser />
          </div>
          <h2>{user.firstName} {user.lastName}</h2>
        </div>
        <nav className="profile-nav">
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          {/* Only show Orders, Favorites, Appointments for non-admin users */}
          {user.role !== 1 && (
            <>
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <FaShoppingBag /> Orders
              </button>
              <button
                className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                <FaHeart /> Favorites
              </button>
              <button
                className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                <FaCalendarAlt /> Appointments
              </button>
            </>
          )}
        </nav>
      </div>
      <div className="profile-content">
        {activeTab === 'profile' && renderProfileInfo()}
        {/* Only show these sections for non-admin users */}
        {user.role !== 1 && activeTab === 'orders' && renderOrders()}
        {user.role !== 1 && activeTab === 'favorites' && renderFavorites()}
        {user.role !== 1 && activeTab === 'appointments' && renderAppointments()}
      </div>
    </div>
  );
};

export default Profile;
