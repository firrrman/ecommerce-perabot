"use server";
import { prisma } from "@/lib/prisma";

export async function bestSeller() {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "asc",
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

export async function getCategoryProducts(category: string) {
  return await prisma.product.findMany({
    where: {
      category: {
        slug: category,
      },
    },
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
