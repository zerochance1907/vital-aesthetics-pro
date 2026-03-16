import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (name: string, price: number) => void;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, qty: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = (name: string, price: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.name === name);
      if (existing) return prev.map(i => i.name === name ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { name, price, quantity: 1 }];
    });
  };

  const removeItem = (name: string) => setItems(prev => prev.filter(i => i.name !== name));

  const updateQuantity = (name: string, qty: number) => {
    if (qty <= 0) return removeItem(name);
    setItems(prev => prev.map(i => i.name === name ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart, isDrawerOpen, setDrawerOpen }}>
      {children}
    </CartContext.Provider>
  );
};
