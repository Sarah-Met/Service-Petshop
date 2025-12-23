import React, { useState, useEffect, useRef } from 'react';
import { FaCheck, FaTimes, FaEdit, FaSave, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosConfig';

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalContentStyle = {
  background: 'white',
  borderRadius: 8,
  padding: '2rem',
  maxWidth: '80vw',
  width: '80vw',
  textAlign: 'center',
  boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
};

const ManageOrders = () => {
  const [editingId, setEditingId] = useState(null);
  const [editedOrder, setEditedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [agreementModal, setAgreementModal] = useState({ open: false, image: null, orderId: null });
  const [imageScale, setImageScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
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
  }, []);

  const inputStyle = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '4px 8px',
    width: '100%',
    minWidth: '80px'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white'
  };

  const statuses = ['pending', 'processing', 'completed', 'cancelled'];

  const handleEdit = (order) => {
    setEditingId(order._id);
    setEditedOrder({ ...order });
  };

  const handleSave = () => {
    setOrders(orders.map(order =>
      order._id === editingId ? editedOrder : order
    ));
    setEditingId(null);
    setEditedOrder(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedOrder(null);
  };

  const handleChange = (field, value) => {
    setEditedOrder(prev => ({
      ...prev,
      [field]: field === 'totalAmount' || field === 'items' ? Number(value) : value
    }));
  };

  const handleAcceptOrder = (id) => {
    console.log('Accept order:', id);
  };

  const handleRejectOrder = (id) => {
    console.log('Reject order:', id);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      // Optimistically update UI
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      // Send update to backend
      await axiosInstance.patch(`/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      // Optionally, show an error and revert UI
    }
  };

  const handleAgreementStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      // Optimistically update UI
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, agreementStatus: newStatus } : order
      ));
      // Send update to backend
      await axiosInstance.patch(`/orders/${orderId}/agreement-status`,
        { agreementStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating agreement status:', error);
      // Revert UI on error
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, agreementStatus: order.agreementStatus } : order
      ));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setImageScale(prev => {
      let next = prev + (e.deltaY < 0 ? 0.1 : -0.1);
      if (next < minScale) next = minScale;
      if (next > 5) next = 5;
      return next;
    });
  };

  useEffect(() => {
    if (agreementModal.open && containerRef.current && imgRef.current) {
      const container = containerRef.current;
      const img = imgRef.current;
      // Use natural size for image
      const naturalWidth = img.naturalWidth || 1;
      const naturalHeight = img.naturalHeight || 1;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const scaleW = containerWidth / naturalWidth;
      const scaleH = containerHeight / naturalHeight;
      const min = Math.min(scaleW, scaleH, 1); // Don't upscale if image is smaller
      setMinScale(min);
      setImageScale(min);
    }
  }, [agreementModal.open, agreementModal.image]);

  useEffect(() => {
    if (!agreementModal.open) setImageScale(1);
  }, [agreementModal.open]);

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2 className="panel-title">Manage Orders</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <React.Fragment key={order._id}>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {order.products.some(i => i.kind === 'Pet') && order.adoptionAgreement && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--primary-red)',
                        display: 'inline-block'
                      }} title="Contains pet with adoption agreement" />
                    )}
                    {order._id.slice(-6)}
                  </div>
                </td>
                <td>{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}, {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{order.products.length}</td>
                <td>{(order.totalAmount || 0).toLocaleString()} EGP</td>
                <td>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    style={{ padding: '0.3rem 0.7rem', borderRadius: 4, border: '1px solid #ddd', background: '#f9f9f9', fontWeight: 600 }}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {order.status === 'pending' && (
                      <button
                        title="Approve Order"
                        onClick={() => handleStatusChange(order._id, 'processing')}
                        style={{
                          background: 'var(--accent-green)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          padding: '0.4rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this order?')) {
                          axiosInstance.delete(`/orders/${order._id}`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                          }).then(() => {
                            setOrders(prev => prev.filter(o => o._id !== order._id));
                          }).catch(err => {
                            console.error('Failed to delete order', err);
                            alert('Failed to delete order');
                          });
                        }
                      }}
                      style={{
                        background: 'var(--primary-red)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: '0.4rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete Order"
                    >
                      <FaTimes />
                    </button>
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                      title={expandedOrderId === order._id ? 'Hide Details' : 'View Details'}
                    >
                      {expandedOrderId === order._id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr>
                  <td colSpan={7} style={{ background: '#fafafa', padding: 0 }}>
                    <div style={{ padding: '1rem 2rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>Order Items</h4>
                      <ul style={{ paddingLeft: 18, margin: 0 }}>
                        {order.products.map((item, idx) => {
                          console.log('Admin - Full order item:', JSON.stringify(item, null, 2));
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
                      {order.products.some(i => i.kind === 'Pet') && order.adoptionAgreement && (
                        <div style={{ marginTop: 18 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <button
                              style={{
                                background: 'var(--primary-red)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                padding: '0.5rem 1.2rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '1rem'
                              }}
                              onClick={() => setAgreementModal({ open: true, image: order.adoptionAgreement, orderId: order._id })}
                            >
                              View Adoption Agreement
                            </button>
                            {order.agreementStatus && (
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '4px',
                                fontWeight: 600,
                                background: order.agreementStatus === 'accepted' ? '#28a745' :
                                  order.agreementStatus === 'rejected' ? '#dc3545' : '#ffc107',
                                color: 'white'
                              }}>
                                Agreement {order.agreementStatus.charAt(0).toUpperCase() + order.agreementStatus.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {agreementModal.open && (
        <div style={modalBackdropStyle} onClick={() => setAgreementModal({ open: false, image: null, orderId: null })}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <h3>Pet Adoption Agreement</h3>
            <div
              ref={containerRef}
              style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '70vh', maxWidth: '75vw', margin: '0 auto' }}
              onWheel={handleWheel}
            >
              <img
                ref={imgRef}
                src={typeof agreementModal.image === 'string' && agreementModal.image.startsWith('http')
                  ? agreementModal.image
                  : `http://localhost:4000${agreementModal.image}`}
                alt="Adoption Agreement"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  margin: '1rem 0',
                  borderRadius: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  objectFit: 'contain',
                  transform: `scale(${imageScale})`,
                  transition: 'transform 0.1s'
                }}
                onLoad={() => {
                  if (containerRef.current && imgRef.current) {
                    const container = containerRef.current;
                    const img = imgRef.current;
                    const naturalWidth = img.naturalWidth || 1;
                    const naturalHeight = img.naturalHeight || 1;
                    const containerWidth = container.offsetWidth;
                    const containerHeight = container.offsetHeight;
                    const scaleW = containerWidth / naturalWidth;
                    const scaleH = containerHeight / naturalHeight;
                    const min = Math.min(scaleW, scaleH, 1);
                    setMinScale(min);
                    setImageScale(min);
                  }
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: 16 }}>
              <button
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.5rem 1.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: agreementModal.orderId && orders.find(o => o._id === agreementModal.orderId)?.agreementStatus === 'accepted' ? 0.5 : 1
                }}
                onClick={() => {
                  handleAgreementStatusUpdate(agreementModal.orderId, 'accepted');
                  setAgreementModal({ open: false, image: null, orderId: null });
                }}
              >
                Accept
              </button>
              <button
                style={{
                  background: '#FF4B4B',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.5rem 1.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: agreementModal.orderId && orders.find(o => o._id === agreementModal.orderId)?.agreementStatus === 'rejected' ? 0.5 : 1
                }}
                onClick={() => {
                  handleAgreementStatusUpdate(agreementModal.orderId, 'rejected');
                  setAgreementModal({ open: false, image: null, orderId: null });
                }}
              >
                Reject
              </button>
            </div>
            <button
              style={{ marginTop: 18, background: 'none', color: 'var(--primary-red)', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
              onClick={() => setAgreementModal({ open: false, image: null, orderId: null })}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageOrders;
