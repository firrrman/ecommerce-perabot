"use client";

import { createContext, useContext, useState, useEffect } from "react";

/* ================= TYPES ================= */
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  weight: number;
  costPrice: number;
  image: string;
  sizeId?: string | null;
  sizeName: string | null;
  colorId?: string | null;
  colorName: string | null;
  quantity: number;
};

type RemoveArgs = {
  productId: string;
  sizeId?: string | null;
  colorId?: string | null;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (args: {
    productId: string;
    sizeId?: string | null;
    colorId?: string | null;
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
          cartItem.colorId === newItem.colorId &&
          cartItem.sizeId === newItem.sizeId,
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.productId === newItem.productId &&
          cartItem.colorId === newItem.colorId &&
          cartItem.sizeId === newItem.sizeId
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

  const removeFromCart = ({ productId, sizeId, colorId }: RemoveArgs) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.sizeId === sizeId &&
            item.colorId === colorId
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
