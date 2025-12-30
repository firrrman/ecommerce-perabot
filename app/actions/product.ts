import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

export async function createProduct(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const details = formData.get("details") as string;
  const categoryId = formData.get("categoryId") as string;
  const images = formData.getAll("image") as File[];
  const selectedColorIds = formData.getAll("colors") as string[];
  const selectedSizeIds = formData.getAll("sizes") as string[];
  const highlightsRaw = formData.get("highlights") as string;
  const basePrice = Number(formData.get("basePrice"));

  const sizeData = selectedSizeIds.map((sizeId) => {
    const price = Number(formData.get(`price-${sizeId}`));

    if (images.length === 0) {
      throw new Error("Minimal 1 gambar harus diupload");
    }

    if (selectedSizeIds.length === 0) {
      throw new Error("Minimal pilih 1 ukuran");
    }

    return {
      sizeId,
      price,
      inStock: true,
    };
  });

  const highlights = highlightsRaw
    ? highlightsRaw
        .split("\n") // split berdasarkan baris
        .map((h) => h.trim()) // hapus spasi di awal/akhir
        .filter(Boolean) // hilangkan baris kosong
    : [];

  if (!name || !slug || !images) {
    throw new Error("Data belum lengkap");
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
      details,
      highlights,
      categoryId: categoryId || null,
      images: {
        create: uploadedImages, // array { src, alt }
      },
      colors: {
        create: selectedColorIds.map((colorId) => ({ colorId })),
      },
      sizes: {
        create: sizeData, // ⬅ harga per size
      },
      basePrice,
    },
  });

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

export async function updateProduct(productId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const details = formData.get("details") as string;
  const categoryId = formData.get("categoryId") as string;
  const images = formData.getAll("image") as File[];
  const selectedColorIds = formData.getAll("colors") as string[];
  const selectedSizeIds = formData.getAll("sizes") as string[];
  const highlightsRaw = formData.get("highlights") as string;
  const basePrice = Number(formData.get("basePrice"));

  if (!name || !slug) {
    throw new Error("Nama dan slug wajib diisi");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
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

  const sizeData = selectedSizeIds.map((sizeId) => {
    const priceRaw = formData.get(`price-${sizeId}`);
    const price = Number(priceRaw);

    if (!priceRaw || isNaN(price)) {
      throw new Error("Harga ukuran tidak valid");
    }

    return {
      sizeId,
      price,
      inStock: true,
    };
  });

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

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      slug,
      description,
      details,
      highlights,
      basePrice,
      categoryId: categoryId || null,

      colors: {
        deleteMany: { productId },
        create: selectedColorIds.map((colorId) => ({ colorId })),
      },

      sizes: {
        deleteMany: { productId },
        create: sizeData,
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
