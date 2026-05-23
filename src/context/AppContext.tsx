"use client";

import { ReactNode, useState, useEffect, useContext, createContext } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  metadata?: {
    color?: string;
    fragrance?: string;
    message?: string;
  };
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, metadata?: CartItem['metadata']) => void;
  updateQuantity: (id: string, quantity: number, metadata?: CartItem['metadata']) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);


  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Create a unique key for comparing items (ID + metadata)
      const getUniqueKey = (item: CartItem) => 
        `${item.id}-${item.metadata?.color || 'default'}-${item.metadata?.fragrance || 'default'}-${item.metadata?.message || ''}`;

      const existing = prev.find((item) => getUniqueKey(item) === getUniqueKey(newItem));

      if (existing) {
        return prev.map((item) =>
          getUniqueKey(item) === getUniqueKey(newItem) 
            ? { ...item, quantity: item.quantity + newItem.quantity } 
            : item
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, metadata?: CartItem['metadata']) => {
    const getUniqueKey = (id: string, meta?: CartItem['metadata']) => 
      `${id}-${meta?.color || 'default'}-${meta?.fragrance || 'default'}-${meta?.message || ''}`;

    setCart((prev) => prev.filter((item) => getUniqueKey(item.id, item.metadata) !== getUniqueKey(id, metadata)));
  };

  const updateQuantity = (id: string, quantity: number, metadata?: CartItem['metadata']) => {
    if (quantity < 1) {
      removeFromCart(id, metadata);
      return;
    }
    const getUniqueKey = (id: string, meta?: CartItem['metadata']) => 
      `${id}-${meta?.color || 'default'}-${meta?.fragrance || 'default'}-${meta?.message || ''}`;

    setCart((prev) => prev.map((item) => (getUniqueKey(item.id, item.metadata) === getUniqueKey(id, metadata) ? { ...item, quantity } : item)));
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      <div className="min-h-screen transition-colors duration-700 w-full relative">
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
