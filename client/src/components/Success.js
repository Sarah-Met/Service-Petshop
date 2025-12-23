import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './Success.css';

const Success = () => {
  useEffect(() => {
   
    return () => {
      localStorage.removeItem('orderCompleted');
    };
  }, []);

  return (
    <div className="success-container">
      <div className="success-content">
        <FaCheckCircle className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your purchase. Your order has been received and is being processed.</p>
        <p>You will receive an email confirmation shortly.</p>
        <div className="success-actions">
          <Link to="/profile?tab=orders" className="view-orders-btn">
            View Orders
          </Link>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success; 
