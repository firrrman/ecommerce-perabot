"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useCustomer } from "./customer-context";
import {
  getCartAction,
  addToCartAction,
  updateCartQuantityAction,
  removeFromCartAction,
  clearCartAction,
  type CartItemInput,
} from "../actions/cart";

/* ================= TYPES ================= */
export type CartItem = {
  productId: string;
  variantId?: string | null;
  variant?: {
    id?: string;
    stock?: number;
    color?: { id: string; name: string; hex: string } | null;
    size?: { id: string; name: string } | null;
  } | null;
  name: string;
  price: number;
  weight: number;
  costPrice: number;
  image: string;
  quantity: number;
  stock?: number;
};

type RemoveArgs = {
  productId: string;
  variantId?: string | null;
};

export type AddToCartResult = {
  success: boolean;
  requireLogin?: boolean;
  message?: string;
};

type CartContextType = {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (item: CartItem) => Promise<AddToCartResult>;
  updateQuantity: (args: {
    productId: string;
    variantId?: string | null;
    quantity: number;
  }) => Promise<{ success: boolean; message?: string }>;
  removeFromCart: (args: RemoveArgs) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

/* ================= HELPERS ================= */

/** Convert CartItem -> CartItemInput (untuk server action) */
function toInput(item: CartItem): CartItemInput {
  return {
    productId: item.productId,
    variantId: item.variantId ?? null,
    productName: item.name,
    colorName: item.variant?.color?.name ?? null,
    sizeName: item.variant?.size?.name ?? null,
    image: item.image,
    price: item.price,
    costPrice: item.costPrice,
    weight: item.weight,
    quantity: item.quantity,
  };
}

/** Convert DB CartItem record -> CartItem (context shape) */
function fromDbItem(dbItem: any): CartItem {
  const stock = dbItem.variant
    ? dbItem.variant.stock
    : (dbItem.product?.stock ?? 0);

  return {
    productId: dbItem.productId,
    variantId: dbItem.variantId ?? null,
    variant: dbItem.variant
      ? {
          id: dbItem.variant.id,
          stock: dbItem.variant.stock,
          color: dbItem.variant.color ?? null,
          size: dbItem.variant.size ?? null,
        }
      : null,
    name: dbItem.productName,
    price: dbItem.price,
    weight: dbItem.weight,
    costPrice: dbItem.costPrice,
    image: dbItem.image,
    quantity: dbItem.quantity,
    stock,
  };
}

/* ================= CONTEXT ================= */
const CartContext = createContext<CartContextType | undefined>(undefined);

/* ================= PROVIDER ================= */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { customer, isLoading: customerLoading } = useCustomer();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Clean up any remaining legacy localStorage cart keys on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
      localStorage.removeItem("cart_guest");
    }
  }, []);

  /* ── Load cart from DB ──────────────────────────────────── */
  const refreshCart = useCallback(async (silent = false) => {
    if (!customer) {
      setCart([]);
      setIsLoading(false);
      return;
    }
    if (!silent) {
      setIsLoading(true);
    }
    try {
      const res = await getCartAction();
      setCart(res.items.map(fromDbItem));
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [customer]);

  /* ── Reaksi terhadap perubahan customer session ─────────── */
  useEffect(() => {
    if (customerLoading) return;

    if (customer) {
      refreshCart();
    } else {
      setCart([]);
      setIsLoading(false);
    }
  }, [customer, customerLoading, refreshCart]);

  /* ================= ACTIONS ================= */
  const addToCart = async (newItem: CartItem): Promise<AddToCartResult> => {
    if (!customer) {
      return {
        success: false,
        requireLogin: true,
        message: "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang",
      };
    }

    const res = await addToCartAction(toInput(newItem));
    if (res.success) {
      await refreshCart(true);
      return { success: true };
    }
    return { success: false, message: res.message || "Gagal menambah ke keranjang" };
  };

  const updateQuantity = async ({
    productId,
    variantId,
    quantity,
  }: {
    productId: string;
    variantId?: string | null;
    quantity: number;
  }) => {
    if (!customer) return { success: false, message: "Belum login" };

    const previousCart = cart;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && (item.variantId ?? null) === (variantId ?? null)
          ? { ...item, quantity }
          : item
      )
    );

    const res = await updateCartQuantityAction({ productId, variantId, quantity });
    if (res.success) {
      await refreshCart(true);
      return { success: true };
    } else {
      setCart(previousCart);
      return { success: false, message: res.message || "Gagal memperbarui jumlah item" };
    }
  };

  const removeFromCart = async ({ productId, variantId }: RemoveArgs) => {
    if (!customer) return;
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && (item.variantId ?? null) === (variantId ?? null))
      )
    );
    await removeFromCartAction({ productId, variantId });
    await refreshCart(true);
  };

  const clearCart = async () => {
    if (customer) {
      await clearCartAction();
    }
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
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
