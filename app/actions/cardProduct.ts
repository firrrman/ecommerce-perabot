"use server";
import { prisma } from "@/lib/prisma";

export async function getKategori() {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function bestSeller() {
  // 1️⃣ Ambil productId + total terjual
  const bestSeller = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.FINISHED],
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  // 2️⃣ Ambil data produk (nama, harga)
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: bestSeller.map((item) => item.productId),
      },
    },
    select: {
      id: true,
      name: true,
      images: true,
      slug: true,
      basePrice: true,
      weight: true,
    },
  });

  // 3️⃣ Gabungkan hasil
  return bestSeller.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    return {
      id: item.productId,
      name: product?.name ?? "-",
      slug: product?.slug ?? "-",
      images: product?.images?.slice(0, 2) ?? [],
      basePrice: product?.basePrice ?? 0,
      weight: product?.weight ?? 0,
    };
  });
}

export async function newProducts() {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      images: true,
      colors: true,
      sizes: {
        include: {
          size: true,
        },
      },
    },
  });
}

import { OrderStatus } from "@prisma/client";

export async function allProducts(
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string,
) {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(Math.max(1, limit), 100);
  const skip = (validPage - 1) * validLimit;

  const whereCondition = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),

    ...(category && {
      category: {
        slug: category, // bisa juga name atau id tergantung schema
      },
    }),
  };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        skip,
        take: validLimit,
        orderBy: { createdAt: "desc" },
        include: {
          images: true,
          colors: true,
          category: true,
          sizes: {
            include: { size: true },
          },
          orderItems: {
            where: {
              order: {
                status: {
                  in: [
                    OrderStatus.PAID,
                    OrderStatus.SHIPPED,
                    OrderStatus.FINISHED,
                  ],
                },
              },
            },
            select: {
              quantity: true,
            },
          },
        },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    const data = products.map((product) => {
      const sold = product.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      const { orderItems, ...rest } = product;

      return {
        ...rest,
        sold,
      };
    });

    return {
      data,
      meta: {
        page: validPage,
        limit: validLimit,
        total,
        totalPage: Math.ceil(total / validLimit),
        search: search || null,
        category: category || null,
      },
    };
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
}

export async function getCategoryProducts(
  category: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(Math.max(1, limit), 100);
  const skip = (validPage - 1) * validLimit;

  // Buat where condition untuk kategori dan search
  const whereCondition: any = {
    category: {
      slug: category,
    },
  };

  if (search) {
    whereCondition.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        skip,
        take: validLimit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          images: true,
          colors: true,
          sizes: {
            include: {
              size: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: products,
      meta: {
        page: validPage,
        limit: validLimit,
        total,
        totalPage: Math.ceil(total / validLimit),
        category,
        search: search || null,
      },
    };
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug: slug },
    include: {
      images: true,
      sizes: {
        include: { size: true },
      },
      colors: {
        include: { color: true },
      },
    },
  });
}
