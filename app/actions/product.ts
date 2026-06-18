import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// tambah kategori
export async function createCategory(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    throw new Error("Nama dan slug wajib diisi");
  }

  await prisma.category.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/admin/tambah-produk");
}

// tambah warna
export async function createColor(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const hex = formData.get("hex") as string;

  if (!name || !hex) {
    throw new Error("Data belum lengkap");
  }

  await prisma.color.create({
    data: {
      name,
      hex,
    },
  });

  revalidatePath("/admin/tambah-produk");
}

// tambah ukuran
export async function createSize(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Data belum lengkap");
  }

  await prisma.size.create({
    data: {
      name,
    },
  });

  revalidatePath("/admin/tambah-produk");
}

// tambah Produk
export async function createProduct(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const images = formData.getAll("image") as File[];
  const highlightsRaw = formData.get("highlights") as string;
  const basePrice = Number(formData.get("basePrice"));
  const costPrice = Number(formData.get("costPrice")) || 0;
  const weight = Number(formData.get("weight"));
  let stock = Number(formData.get("stock")) || 0;
  const is_featured = formData.get("is_featured") === "true";

  if (images.length === 0) {
    throw new Error("Minimal 1 gambar harus diupload");
  }

  if (!name || !slug) {
    throw new Error("Data belum lengkap");
  }

  // Build variant data dari input dynamic row
  const variantCount = Number(formData.get("variantCount")) || 0;
  const variantData: {
    sizeId?: string;
    colorId?: string;
    price?: number;
    costPrice: number;
    weight: number;
    stock: number;
  }[] = [];

  for (let i = 0; i < variantCount; i++) {
    const sizeId = formData.get(`variant_sizeId_${i}`) as string;
    const colorId = formData.get(`variant_colorId_${i}`) as string;
    const priceRaw = formData.get(`variant_price_${i}`);
    const costPriceRaw = formData.get(`variant_costPrice_${i}`);
    const weightRaw = formData.get(`variant_weight_${i}`);
    const stockRaw = formData.get(`variant_stock_${i}`);

    const finalSizeId = sizeId || undefined;
    const finalColorId = colorId || undefined;

    // Masukkan ke variant data jika minimal memilih ukuran atau warna
    if (finalSizeId || finalColorId) {
      const price = priceRaw ? Number(priceRaw) : undefined;
      const cPrice = costPriceRaw ? Number(costPriceRaw) : 0;
      const wght = weightRaw ? Number(weightRaw) : 0;
      const stck = stockRaw ? Number(stockRaw) : 0;

      variantData.push({
        sizeId: finalSizeId,
        colorId: finalColorId,
        price: isNaN(price as number) ? undefined : price,
        costPrice: isNaN(cPrice) ? 0 : cPrice,
        weight: isNaN(wght) ? 0 : wght,
        stock: isNaN(stck) ? 0 : stck,
      });
    }
  }

  const highlights = highlightsRaw
    ? highlightsRaw
      .split("\n") // split berdasarkan baris
      .map((h) => h.trim()) // hapus spasi di awal/akhir
      .filter(Boolean) // hilangkan baris kosong
    : [];

  // Hitung total stok dari semua variant
  if (variantData.length > 0) {
    stock = variantData.reduce((sum, v) => sum + v.stock, 0);
  }

  /* =====================
       UPLOAD IMAGE
    ====================== */
  const uploadedImages = [];

  for (const image of images) {
    const fileName = `${crypto.randomUUID()}-${image.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, image, {
        contentType: image.type,
        upsert: false, // penting
      });

    if (error) {
      console.error("UPLOAD ERROR:", error);
      throw new Error("Gagal upload gambar");
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);

    uploadedImages.push({
      src: data.publicUrl,
      path: fileName,
      alt: name,
    });
  }

  /* =====================
       SIMPAN PRODUCT
    ====================== */
  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      highlights,
      categoryId: categoryId || null,
      stock,
      images: {
        create: uploadedImages,
      },
      variants: {
        create: variantData,
      },
      basePrice,
      costPrice,
      weight,
      is_featured,
    },
  });

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

// update produk
export async function updateProduct(productId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const images = formData.getAll("image") as File[];
  const highlightsRaw = formData.get("highlights") as string;
  const basePrice = Number(formData.get("basePrice"));
  const costPrice = Number(formData.get("costPrice")) || 0;
  const weight = Number(formData.get("weight"));
  let stock = Number(formData.get("stock")) || 0;
  const is_featured = formData.get("is_featured") === "true";
  if (!name || !slug) {
    throw new Error("Nama dan slug wajib diisi");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, variants: true },
  });

  if (!product) {
    throw new Error("Produk tidak ditemukan");
  }

  const highlights = highlightsRaw
    ? highlightsRaw
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean)
    : [];

  // Build variant data dari input dynamic row
  const variantCount = Number(formData.get("variantCount")) || 0;
  const variantData: {
    id: string;
    sizeId?: string;
    colorId?: string;
    price?: number;
    costPrice: number;
    weight: number;
    stock: number;
  }[] = [];

  for (let i = 0; i < variantCount; i++) {
    const vId = formData.get(`variant_id_${i}`) as string;
    const sizeId = formData.get(`variant_sizeId_${i}`) as string;
    const colorId = formData.get(`variant_colorId_${i}`) as string;
    const priceRaw = formData.get(`variant_price_${i}`);
    const costPriceRaw = formData.get(`variant_costPrice_${i}`);
    const weightRaw = formData.get(`variant_weight_${i}`);
    const stockRaw = formData.get(`variant_stock_${i}`);

    const finalSizeId = sizeId || undefined;
    const finalColorId = colorId || undefined;

    // Masukkan ke variant data jika minimal memilih ukuran atau warna
    if (finalSizeId || finalColorId) {
      const price = priceRaw ? Number(priceRaw) : undefined;
      const cPrice = costPriceRaw ? Number(costPriceRaw) : 0;
      const wght = weightRaw ? Number(weightRaw) : 0;
      const stck = stockRaw ? Number(stockRaw) : 0;

      variantData.push({
        id: vId || crypto.randomUUID(), // Fallback if missing
        sizeId: finalSizeId,
        colorId: finalColorId,
        price: isNaN(price as number) ? undefined : price,
        costPrice: isNaN(cPrice) ? 0 : cPrice,
        weight: isNaN(wght) ? 0 : wght,
        stock: isNaN(stck) ? 0 : stck,
      });
    }
  }

  let uploadedImages: { src: string; alt: string; path: string }[] = [];

  const hasNewImage =
    images.length > 0 && images[0] instanceof File && images[0].size > 0;

  if (hasNewImage) {
    for (const image of images) {
      const fileName = `${crypto.randomUUID()}-${image.name}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, image);

      if (error) throw new Error("Gagal upload gambar");

      const { data } = supabase.storage.from("products").getPublicUrl(fileName);

      uploadedImages.push({
        src: data.publicUrl,
        path: fileName,
        alt: name,
      });
    }
  }

  if (hasNewImage && product.images.length > 0) {
    const paths = product.images.map((img) => img.path);

    const { error } = await supabaseAdmin.storage
      .from("products")
      .remove(paths as string[]);

    if (error) {
      console.error(error);
      throw new Error("Gagal menghapus gambar lama di storage");
    }
  }

  // Hitung total stok dari semua variant
  if (variantData.length > 0) {
    stock = variantData.reduce((sum, v) => sum + v.stock, 0);
  }

  // Prepare variants updates
  const existingVariants = product.variants;
  const submittedIds = variantData.map((v) => v.id);

  const variantsToDelete = existingVariants
    .filter((ev) => !submittedIds.includes(ev.id))
    .map((ev) => ev.id);


  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      slug,
      description,
      highlights,
      basePrice,
      costPrice,
      weight,
      is_featured,
      stock,
      categoryId: categoryId || null,

      variants: {
        deleteMany: variantsToDelete.length > 0 ? { id: { in: variantsToDelete } } : undefined,
        upsert: variantData.map((v) => ({
          where: { id: v.id },
          update: {
            sizeId: v.sizeId,
            colorId: v.colorId,
            price: v.price,
            costPrice: v.costPrice,
            weight: v.weight,
            stock: v.stock,
          },
          create: {
            id: v.id,
            sizeId: v.sizeId,
            colorId: v.colorId,
            price: v.price,
            costPrice: v.costPrice,
            weight: v.weight,
            stock: v.stock,
          },
        })),
      },

      ...(hasNewImage && {
        images: {
          deleteMany: { productId },
          create: uploadedImages,
        },
      }),
    },
  });

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

// hapus produk
export async function deleteProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!product) throw new Error("Produk tidak ditemukan");

  const paths = product.images
    .map((img) => img.path)
    .filter((path): path is string => path !== null);

  if (paths.length > 0) {
    const { error } = await supabaseAdmin.storage
      .from("products")
      .remove(paths);

    if (error) {
      console.error(error);
      throw new Error("Gagal hapus file storage");
    }
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  return { success: true };
}
