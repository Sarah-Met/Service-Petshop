import React, { useState } from 'react';
import { FaPaw, FaBox, FaListAlt, FaShoppingCart, FaTachometerAlt } from 'react-icons/fa';
import './AdminDashboard.css';
import ManagePets from './admin/ManagePets';
import ManageProducts from './admin/ManageProducts';
import ManageCategories from './admin/ManageCategories';
import ManageOrders from './admin/ManageOrders';
import DashboardHome from './admin/DashboardHome';

const AdminDashboard = () => {
  const [activePanel, setActivePanel] = useState('dashboard');

  const renderContent = () => {
    switch (activePanel) {
      case 'dashboard':
        return <DashboardHome />;
      case 'pets':
        return <ManagePets />;
      case 'products':
        return <ManageProducts />;
      case 'categories':
        return <ManageCategories />;
      case 'orders':
        return <ManageOrders />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <FaTachometerAlt />
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activePanel === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePanel('dashboard')}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activePanel === 'pets' ? 'active' : ''}`}
            onClick={() => setActivePanel('pets')}
          >
            <FaPaw />
            <span>Manage Pets</span>
          </button>
          <button
            className={`nav-item ${activePanel === 'products' ? 'active' : ''}`}
            onClick={() => setActivePanel('products')}
          >
            <FaBox />
            <span>Manage Products</span>
          </button>
          <button
            className={`nav-item ${activePanel === 'categories' ? 'active' : ''}`}
            onClick={() => setActivePanel('categories')}
          >
            <FaListAlt />
            <span>Manage Categories</span>
          </button>
          <button
            className={`nav-item ${activePanel === 'orders' ? 'active' : ''}`}
            onClick={() => setActivePanel('orders')}
          >
            <FaShoppingCart />
            <span>Manage Orders</span>
          </button>
        </nav>
      </div>
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
