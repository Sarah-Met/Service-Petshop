import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
    pet: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Submit date as just the date component or full object (DTO handles it), but ensure time is sent separately
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        petName: formData.pet,
        date: new Date(formData.date), // Send date object
        time: formData.time,          // Send time string separately
        notes: formData.reason,       // Map reason to notes
        service: 'General Checkup'    // Default service
      };
      const res = await axiosInstance.post('/appointments', payload);
      if (res.data.success) {
        setSuccess('Appointment submitted successfully! We will contact you to confirm.');
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          reason: '',
          pet: ''
        });
      } else {
        setError(res.data.message || 'Failed to submit appointment');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">MAKE AN APPOINTMENT!</h1>
      <p className="contact-subtitle">
        Schedule a medical visit to the vet or consultation with us! Fill out the form below and our team will get back to you to confirm your appointment.
      </p>

      <div className="contact-form-container">
        <h2 className="message-title">Book Your Appointment</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pet name text input */}
          <div className="form-group">
            <label htmlFor="pet">Pet Name</label>
            <input
              type="text"
              id="pet"
              name="pet"
              placeholder="Enter your pet's name"
              value={formData.pet}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Preferred Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Preferred Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Appointment</label>
            <textarea
              id="reason"
              name="reason"
              placeholder="Let us know the reason for your visit"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
