import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import axios from 'axios';
import './Register.css';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    securityAnswer: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:4000/api/v1/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        securityAnswer: formData.securityAnswer
      });

      if (res.data.success) {
        navigate('/login');
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-card register-card">
        <FaPaw className="login-paw-icon" />
        <h1 className="login-title">Register</h1>
        <div className="login-accent-bar"></div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="register-form-container">
            <div className="register-form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="securityAnswer">Security Question</label>
              <input
                type="text"
                id="securityAnswer"
                name="securityAnswer"
                value={formData.securityAnswer}
                onChange={handleChange}
                placeholder="What is your favorite sport?"
                required
              />
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn register-btn">Register</button>
        </form>
        <div className="login-signup-link">Already have an account? <Link to="/login">Login</Link></div>
      </div>
    </div>
  );
};

export default Register;
