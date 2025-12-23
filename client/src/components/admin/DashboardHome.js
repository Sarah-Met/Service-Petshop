import React, { useState, useEffect } from 'react';
import { FaPaw, FaBox, FaShoppingCart, FaUsers, FaSync, FaCheck, FaTimes } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosConfig';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalPets: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState({
    pets: true,
    products: true,
    orders: true,
    users: true
  });
  const [error, setError] = useState({
    pets: '',
    products: '',
    orders: '',
    users: ''
  });
  const [refreshing, setRefreshing] = useState(false);

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchAppointments();
  }, []);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      setError({
        pets: '',
        products: '',
        orders: '',
        users: ''
      });

      // Fetch pets count
      try {
        const petsResponse = await axiosInstance.get('/pets');
        setStats(prev => ({
          ...prev,
          totalPets: petsResponse.data.pets?.length || 0
        }));
        setLoading(prev => ({ ...prev, pets: false }));
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError(prev => ({
          ...prev,
          pets: 'Failed to fetch pets count'
        }));
        setLoading(prev => ({ ...prev, pets: false }));
      }

      // Fetch users count
      try {
        const usersResponse = await axiosInstance.get('/users');
        setStats(prev => ({
          ...prev,
          totalUsers: usersResponse.data.users?.length || 0
        }));
        setLoading(prev => ({ ...prev, users: false }));
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(prev => ({
          ...prev,
          users: 'Failed to fetch users count'
        }));
        setLoading(prev => ({ ...prev, users: false }));
      }

      // Fetch products count
      try {
        console.log('Fetching products...');
        const productsResponse = await axiosInstance.get('/products');
        console.log('Products response:', productsResponse.data);

        if (productsResponse.data && typeof productsResponse.data.count === 'number') {
          setStats(prev => ({
            ...prev,
            totalProducts: productsResponse.data.count
          }));
        } else {
          console.warn('Invalid products response format:', productsResponse.data);
          setStats(prev => ({
            ...prev,
            totalProducts: 0
          }));
        }
        setLoading(prev => ({ ...prev, products: false }));
      } catch (err) {
        console.error('Error fetching products:', err);
        setStats(prev => ({
          ...prev,
          totalProducts: 0
        }));
        setError(prev => ({
          ...prev,
          products: 'Failed to fetch products count'
        }));
        setLoading(prev => ({ ...prev, products: false }));
      }

      // Fetch orders count
      try {
        const token = localStorage.getItem('token');
        const ordersResponse = await axiosInstance.get('/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(prev => ({
          ...prev,
          totalOrders: ordersResponse.data.orders?.length || 0
        }));
        setLoading(prev => ({ ...prev, orders: false }));
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(prev => ({
          ...prev,
          orders: 'Failed to fetch orders count'
        }));
        setLoading(prev => ({ ...prev, orders: false }));
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
      setError({
        pets: 'Failed to fetch statistics',
        products: 'Failed to fetch statistics',
        orders: 'Failed to fetch statistics',
        users: 'Failed to fetch statistics'
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch all appointments for admin
  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    setAppointmentsError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.get('/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAppointments(res.data.appointments);
      } else {
        setAppointmentsError(res.data.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      setAppointmentsError('Failed to fetch appointments');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const handleRetry = (stat) => {
    setLoading(prev => ({ ...prev, [stat]: true }));
    setError(prev => ({ ...prev, [stat]: '' }));
    fetchStats();
  };

  return (
    <div className="admin-panel">
      <div className="flex justify-between items-center mb-6">
        <h2 className="panel-title">Dashboard Overview</h2>
        <button
          onClick={fetchStats}
          disabled={refreshing}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <FaSync className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Stats'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <StatCard
          icon={<FaPaw />}
          title="Total Pets"
          value={stats.totalPets}
          color="var(--primary-red)"
          loading={loading.pets}
          error={error.pets}
          onRetry={() => handleRetry('pets')}
        />
        <StatCard
          icon={<FaBox />}
          title="Total Products"
          value={stats.totalProducts}
          color="var(--accent-green)"
          loading={loading.products}
          error={error.products}
          onRetry={() => handleRetry('products')}
        />
        <StatCard
          icon={<FaShoppingCart />}
          title="Total Orders"
          value={stats.totalOrders}
          color="var(--button-dark)"
          loading={loading.orders}
          error={error.orders}
          onRetry={() => handleRetry('orders')}
        />
        <StatCard
          icon={<FaUsers />}
          title="Total Users"
          value={stats.totalUsers}
          color="var(--primary-red)"
          loading={loading.users}
          error={error.users}
          onRetry={() => handleRetry('users')}
        />
      </div>
      <div className="panel-header" style={{ marginTop: '2rem' }}>
        <h2 className="panel-title">All Appointments</h2>
      </div>
      {appointmentsLoading ? (
        <div>Loading appointments...</div>
      ) : appointmentsError ? (
        <div style={{ color: 'red' }}>{appointmentsError}</div>
      ) : appointments.length === 0 ? (
        <div>No appointments found.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Pet</th>
              <th>Date</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => {
              // Extract phone from notes if not present
              let phone = appt.phone || '';
              if (!phone && appt.notes) {
                const match = appt.notes.match(/Phone:\s*([\d\-+ ]+)/i);
                if (match) phone = match[1].trim();
              }
              return (
                <tr key={appt._id}>
                  <td>{appt.name || (appt.user ? `${appt.user.firstName} ${appt.user.lastName}` : 'N/A')}</td>
                  <td>{appt.email || (appt.user ? appt.user.email : 'N/A')}</td>
                  <td>{phone || 'N/A'}</td>
                  <td>{appt.petName || (appt.pet ? appt.pet.name : 'N/A')}</td>
                  <td>{appt.date ? new Date(appt.date).toLocaleString() : 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${appt.status}`}>{appt.status}</span>
                  </td>
                  <td>{appt.notes || ''}</td>
                  <td>
                    {appt.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', marginLeft: '-0.5rem' }}>
                        <button
                          style={{
                            background: 'var(--accent-green)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            fontWeight: 900,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(40,167,69,0.08)'
                          }}
                          title="Approve"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              await axiosInstance.put(`/appointments/${appt._id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
                              setAppointments(prev => prev.map(a => a._id === appt._id ? { ...a, status: 'approved' } : a));
                            } catch (err) {
                              alert('Failed to approve appointment');
                            }
                          }}
                        >
                          <FaCheck />
                        </button>
                        <button
                          style={{
                            background: 'var(--primary-red)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            fontWeight: 900,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(255,77,77,0.08)'
                          }}
                          title="Reject"
                          onClick={async () => {
                            if (!window.confirm('Are you sure you want to reject this appointment?')) return;
                            try {
                              const token = localStorage.getItem('token');
                              await axiosInstance.put(`/appointments/${appt._id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
                              setAppointments(prev => prev.map(a => a._id === appt._id ? { ...a, status: 'rejected' } : a));
                            } catch (err) {
                              alert('Failed to reject appointment');
                            }
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, color, loading, error, onRetry }) => (
  <div style={{
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }}>
    <div style={{
      background: color,
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </div>
    <div className="flex-1">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      ) : error ? (
        <div>
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <button
            onClick={onRetry}
            className="text-blue-500 text-sm hover:text-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <h3 style={{ margin: '0', color: '#2c3e50', fontSize: '1.5rem' }}>{value}</h3>
          <p style={{ margin: '0.25rem 0 0 0', color: '#7f8c8d' }}>{title}</p>
        </>
      )}
    </div>
  </div>
);

export default DashboardHome;
