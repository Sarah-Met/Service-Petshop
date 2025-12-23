import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const MakeAppointment = () => {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.role === 1) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Admins cannot make appointments.</div>;
  }

  const [petName, setPetName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to make an appointment.');
      const payload = { petName, date, notes };
      const res = await axiosInstance.post('/appointments', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSuccess('Appointment request submitted!');
        setPetName('');
        setDate('');
        setNotes('');
      } else {
        setError(res.data.message || 'Failed to submit appointment.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-form-container" style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Make an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Pet Name:</label>
          <input
            type="text"
            value={petName}
            onChange={e => setPetName(e.target.value)}
            required
            placeholder="Enter your pet's name"
            style={{ width: '100%', padding: 8, borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Date & Time:</label>
          <input 
            type="datetime-local" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required 
            style={{ width: '100%', padding: 8, borderRadius: 4 }} 
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Notes (optional):</label>
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            rows={3} 
            placeholder="Any additional information about your pet or the appointment"
            style={{ width: '100%', padding: 8, borderRadius: 4 }} 
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: 10, background: 'var(--primary-red)', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600 }}
        >
          {loading ? 'Submitting...' : 'Make Appointment'}
        </button>
      </form>
    </div>
  );
};

export default MakeAppointment; 
