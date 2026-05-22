"use client";

import { createContext, useContext, useState, useEffect } from "react";

/* ================= TYPES ================= */
export type CartItem = {
  productId: string;
  variantId?: string | null;
  variant?: {
    id: string;
    color?: { id: string; name: string; hex: string } | null;
    size?: { id: string; name: string } | null;
  } | null;
  name: string;
  price: number;
  weight: number;
  costPrice: number;
  image: string;
  quantity: number;
};

type RemoveArgs = {
  productId: string;
  variantId?: string | null;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (args: {
    productId: string;
    variantId?: string | null;
  }) => void;
  clearCart: () => void;
};

/* ================= CONTEXT ================= */
const CartContext = createContext<CartContextType | undefined>(undefined);

/* ================= PROVIDER ================= */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🔹 Load dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // 🔹 Simpan ke localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ================= ACTIONS ================= */
  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem.productId === newItem.productId &&
          cartItem.variantId === newItem.variantId,
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.productId === newItem.productId &&
          cartItem.variantId === newItem.variantId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + newItem.quantity,
              }
            : cartItem,
        );
      }

      return [...prevCart, newItem];
    });
  };

  const removeFromCart = ({ productId, variantId }: RemoveArgs) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.variantId === variantId
          ),
      ),
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
