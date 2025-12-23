import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import './Login.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      if (res.data.success) {
        // Save user info and token to localStorage
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        if (setUser) setUser(res.data.user);
        // Redirect based on role
        if (res.data.user && res.data.user.role === 1) {
          navigate(location.state?.from || '/admin');
        } else {
          navigate(location.state?.from || '/');
        }
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosInstance.post('/auth/forgot-password', {
        email,
        securityAnswer,
        newPassword
      });
      if (res.data.success) {
        setResetSuccess(true);
        setShowForgotPassword(false);
        setSecurityAnswer('');
        setNewPassword('');
      } else {
        setError(res.data.message || 'Password reset failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      console.error('Password reset error:', err);
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-card">
        <FaPaw className="login-paw-icon" />
        <h1 className="login-title">{showForgotPassword ? 'Reset Password' : 'Login'}</h1>
        <div className="login-accent-bar"></div>
        {!showForgotPassword ? (
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="username"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        ) : (
          <form className="login-form" onSubmit={handleForgotPassword}>
            <label htmlFor="forgotEmail">Email</label>
            <input
              type="email"
              id="forgotEmail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="username"
            />
            <label htmlFor="securityAnswer">Security Answer</label>
            <input
              type="text"
              id="securityAnswer"
              value={securityAnswer}
              onChange={e => setSecurityAnswer(e.target.value)}
              placeholder="What is your favorite sport?"
            />
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            {error && <div className="login-error">{error}</div>}
            {resetSuccess && <div className="login-success">Password reset successful!</div>}
            <button type="submit" className="login-btn">Reset Password</button>
          </form>
        )}
        <div className="login-signup-link">
          Don't have an account? <Link to="/register">Sign up</Link>
          <br />
          <span
            className="forgot-password-signup-link"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot password?
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
