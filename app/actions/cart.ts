"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

/* ────────────────────────────────────────────────────────
   Helper — ambil customerId dari session cookie
──────────────────────────────────────────────────────── */
async function getCustomerId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("customer_session")?.value ?? null;
}

/* ────────────────────────────────────────────────────────
   GET cart
──────────────────────────────────────────────────────── */
export async function getCartAction() {
  const customerId = await getCustomerId();
  if (!customerId) return { success: false, items: [] };

  try {
    const items = await prisma.cartItem.findMany({
      where: { customerId },
      include: {
        product: {
          select: { stock: true },
        },
        variant: {
          include: { color: true, size: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, items };
  } catch (error) {
    console.error("getCartAction error:", error);
    return { success: false, items: [] };
  }
}

/* ────────────────────────────────────────────────────────
   ADD / UPDATE item
──────────────────────────────────────────────────────── */
export type CartItemInput = {
  productId: string;
  variantId?: string | null;
  productName: string;
  colorName?: string | null;
  sizeName?: string | null;
  image: string;
  price: number;
  costPrice: number;
  weight: number;
  quantity: number;
};

export async function addToCartAction(item: CartItemInput) {
  const customerId = await getCustomerId();
  if (!customerId) return { success: false, message: "Belum login" };

  try {
    const existing = await prisma.cartItem.findFirst({
      where: {
        customerId,
        productId: item.productId,
        variantId: item.variantId ?? null,
      },
    });

    let availableStock = 0;
    if (item.variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        select: { stock: true },
      });
      availableStock = variant?.stock ?? 0;
    } else {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true },
      });
      availableStock = product?.stock ?? 0;
    }

    const currentQty = existing ? existing.quantity : 0;
    const requestedQty = currentQty + item.quantity;

    if (requestedQty > availableStock) {
      return {
        success: false,
        message: `Stok tidak mencukupi. Sisa stok: ${availableStock}${currentQty > 0 ? ` (Sudah ada ${currentQty} di keranjang)` : ""}`,
      };
    }

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          customerId,
          productId: item.productId,
          variantId: item.variantId ?? null,
          productName: item.productName,
          colorName: item.colorName ?? null,
          sizeName: item.sizeName ?? null,
          image: item.image,
          price: item.price,
          costPrice: item.costPrice,
          weight: item.weight,
          quantity: item.quantity,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("addToCartAction error:", error);
    return { success: false, message: "Gagal menambah ke keranjang" };
  }
}

/* ────────────────────────────────────────────────────────
   UPDATE QUANTITY
──────────────────────────────────────────────────────── */
export async function updateCartQuantityAction({
  productId,
  variantId,
  quantity,
}: {
  productId: string;
  variantId?: string | null;
  quantity: number;
}) {
  const customerId = await getCustomerId();
  if (!customerId) return { success: false, message: "Belum login" };

  if (quantity < 1) {
    return { success: false, message: "Jumlah minimal 1" };
  }

  try {
    const existing = await prisma.cartItem.findFirst({
      where: {
        customerId,
        productId,
        variantId: variantId ?? null,
      },
    });

    if (!existing) {
      return { success: false, message: "Item tidak ditemukan di keranjang" };
    }

    let availableStock = 0;
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { stock: true },
      });
      availableStock = variant?.stock ?? 0;
    } else {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { stock: true },
      });
      availableStock = product?.stock ?? 0;
    }

    if (quantity > availableStock) {
      return {
        success: false,
        message: `Stok tidak mencukupi. Sisa stok: ${availableStock}`,
      };
    }

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity },
    });

    return { success: true };
  } catch (error) {
    console.error("updateCartQuantityAction error:", error);
    return { success: false, message: "Gagal memperbarui jumlah item" };
  }
}

/* ────────────────────────────────────────────────────────
   REMOVE item
──────────────────────────────────────────────────────── */
export async function removeFromCartAction({
  productId,
  variantId,
}: {
  productId: string;
  variantId?: string | null;
}) {
  const customerId = await getCustomerId();
  if (!customerId) return { success: false };

  try {
    await prisma.cartItem.deleteMany({
      where: {
        customerId,
        productId,
        variantId: variantId ?? null,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("removeFromCartAction error:", error);
    return { success: false };
  }
}

/* ────────────────────────────────────────────────────────
   CLEAR cart
──────────────────────────────────────────────────────── */
export async function clearCartAction() {
  const customerId = await getCustomerId();
  if (!customerId) return { success: false };

  try {
    await prisma.cartItem.deleteMany({ where: { customerId } });
    return { success: true };
  } catch (error) {
    console.error("clearCartAction error:", error);
    return { success: false };
  }
}
