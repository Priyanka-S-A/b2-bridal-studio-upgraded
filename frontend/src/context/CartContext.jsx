import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

const STORAGE_KEY = 'b2_cart';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, quantityToAdd = 1) => {
    setItems(prev => {
      const key = product._id || product.id;
      const existing = prev.find(i => (i._id || i.id) === key);
      if (existing) {
        return prev.map(i =>
          (i._id || i.id) === key
            ? { ...i, quantity: i.quantity + quantityToAdd }
            : i
        );
      }
      return [...prev, { ...product, quantity: quantityToAdd }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems(prev => prev.filter(i => (i._id || i.id) !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      setItems(prev => prev.filter(i => (i._id || i.id) !== productId));
      return;
    }
    setItems(prev =>
      prev.map(i =>
        (i._id || i.id) === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(p => !p), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        items, itemCount, subtotal, total,
        isOpen, openCart, closeCart, toggleCart,
        addToCart, removeFromCart, updateQuantity, clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
