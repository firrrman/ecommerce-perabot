"use server";

import { prisma } from "@/lib/prisma";

export async function checkSlugExists(
  slug: string,
  excludeProductId?: string
): Promise<{ exists: boolean; productName?: string }> {
  if (!slug || slug.trim() === "") return { exists: false };

  const product = await prisma.product.findFirst({
    where: {
      slug: slug.trim(),
      ...(excludeProductId ? { NOT: { id: excludeProductId } } : {}),
    },
    select: { name: true },
  });

  if (product) {
    return { exists: true, productName: product.name };
  }
  return { exists: false };
}
