import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash } from 'react-icons/fa';
import sadDog from '../images/sad-dog.png';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();

    // Calculate total price
    const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="empty-cart-container">
                <h1 className="empty-cart-title">Your Cart Is Empty!</h1>

                <img
                    src={sadDog}
                    alt="Sad Dog Icon"
                    className="empty-cart-icon"
                />

                <p className="empty-cart-message">
                    but our store is full of products waiting to be added.
                </p>

                <h2 className="find-friend-title">Find Your Pet's Favorites</h2>

                <Link to="/products" className="adopt-now-button">
                    SHOP NOW!
                </Link>

                <p className="empty-cart-description">
                    Discover our wide range of pet products and find the perfect items for your furry friend.
                </p>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">Your Shopping Cart</h1>

            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item._id} className="cart-item" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <div className="cart-item-image">
                            <img
                                src={`http://localhost:4000${item.image}`}
                                alt={item.name}
                                onError={(e) => {
                                    e.target.src = '/default-product.jpg';
                                }}
                            />
                        </div>
                        <div className="cart-item-details" style={{ flex: 1 }}>
                            <h3>{item.name}</h3>
                            {item.type === 'pet' && <span className="cart-item-type">Pet</span>}
                            {item.type === 'product' && <span className="cart-item-type">Product</span>}
                            <p className="cart-item-description">{item.description || item.breed}</p>
                            <div className="cart-item-price">{item.price} EGP</div>
                            <div className="cart-item-quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button
                                    onClick={() => updateQuantity(item._id, item.type, (item.quantity || 1) - 1)}
                                    disabled={item.quantity <= 1}
                                    style={{ background: '#eee', border: 'none', borderRadius: '4px', padding: '0.25rem 0.75rem', fontWeight: 700, fontSize: '1.1rem', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer' }}
                                >-</button>
                                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity || 1}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.type, (item.quantity || 1) + 1)}
                                    style={{ background: '#eee', border: 'none', borderRadius: '4px', padding: '0.25rem 0.75rem', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}
                                >+</button>
                            </div>
                        </div>
                        <div className="cart-item-actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: '120px' }}>
                            <button
                                onClick={() => removeFromCart(item._id, item.type)}
                                className="remove-btn"
                                style={{ background: 'var(--primary-red)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: 'auto' }}
                            >
                                <FaTrash /> Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="cart-total">
                    <span>Total:</span>
                    <span>{total.toFixed(2)} EGP</span>
                </div>

                <div className="cart-actions">
                    <button onClick={clearCart} className="clear-cart-btn">
                        Clear Cart
                    </button>
                    <Link to="/checkout" className="checkout-btn">
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
