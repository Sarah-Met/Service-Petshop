import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Clear cart when user logs out
  useEffect(() => {
    const handleStorage = () => {
      const user = localStorage.getItem('user');
      if (!user) {
        setCartItems([]);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addToCart = (item, type) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id && i.type === type);
      if (existing) {
        return prev.map(i =>
          i._id === item._id && i.type === type
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...item, type, quantity: 1 }];
    });
  };

  const updateQuantity = (id, type, quantity) => {
    setCartItems(prev =>
      prev.map(i =>
        i._id === id && i.type === type
          ? { ...i, quantity: Math.max(1, quantity) }
          : i
      )
    );
  };

  const removeFromCart = (id, type) => {
    setCartItems(prev => prev.filter(i => !(i._id === id && i.type === type)));
  };

  const clearCart = () => setCartItems([]);

  // Add getCartTotal function
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}; 
