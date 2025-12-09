import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // --- EXISTING STATE ---
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('cooskie_cart');
      return local ? JSON.parse(local) : [];
    }
    return [];
  });

  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('cooskie_favorites');
      return local ? JSON.parse(local) : [];
    }
    return [];
  });

  // --- NEW STATE: ORDER HISTORY ---
  const [orderHistory, setOrderHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('cooskie_orders');
      return local ? JSON.parse(local) : [];
    }
    return [];
  });

  // --- EXISTING EFFECTS ---
  useEffect(() => {
    localStorage.setItem('cooskie_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cooskie_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // --- NEW EFFECT: SAVE ORDERS ---
  useEffect(() => {
    localStorage.setItem('cooskie_orders', JSON.stringify(orderHistory));
  }, [orderHistory]);

  // --- EXISTING FUNCTIONS ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, qty: Math.max(1, item.qty + delta) };
      return item;
    }));
  };

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const clearCart = () => setCart([]);

  // --- NEW FUNCTION: ADD ORDER ---
  const addOrderToHistory = (orderData) => {
    setOrderHistory(prev => [orderData, ...prev]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price_cents * item.qty), 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal,
      favorites, toggleFavorite,
      orderHistory, addOrderToHistory // Export fungsi baru
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);