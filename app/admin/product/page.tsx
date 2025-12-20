import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export default async function AdminProductPage() {
  const colors = await prisma.color.findMany({ orderBy: { name: "asc" } });
  const sizes = await prisma.size.findMany({ orderBy: { name: "asc" } });
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  async function createCategory(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
      throw new Error("Data belum lengkap");
    }

    await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    revalidatePath("/admin/product");
  }

  async function createColor(formData: FormData) {
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

    revalidatePath("/admin/product");
  }

  async function createSize(formData: FormData) {
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

    revalidatePath("/admin/product");
  }

  async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const details = formData.get("details") as string;
    const categoryId = formData.get("categoryId") as string;
    const images = formData.getAll("image") as File[];
    const selectedColorIds = formData.getAll("colors") as string[];
    const selectedSizeIds = formData.getAll("sizes") as string[];
    const highlightsRaw = formData.get("highlights") as string;

    const highlights = highlightsRaw
      ? highlightsRaw
          .split("\n") // split berdasarkan baris
          .map((h) => h.trim()) // hapus spasi di awal/akhir
          .filter(Boolean) // hilangkan baris kosong
      : [];

    if (!name || !slug || !price || !images) {
      throw new Error("Data belum lengkap");
    }

    /* =====================
       UPLOAD IMAGE
    ====================== */
    const uploadedImages = [];

    for (const image of images) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, image, { contentType: image.type });

      if (error) throw error;

      const { data } = supabase.storage.from("products").getPublicUrl(fileName);
      uploadedImages.push({ src: data.publicUrl, alt: name });
    }

    /* =====================
       SIMPAN PRODUCT
    ====================== */
    await prisma.product.create({
      data: {
        name,
        slug,
        price,
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
          create: selectedSizeIds.map((sizeId) => ({ sizeId, inStock: true })),
        },
      },
    });

    revalidatePath("/admin/product");
  }

  const products = await prisma.product.findMany({
    include: { images: true, category: true, colors: true, sizes: true },
    orderBy: { createdAt: "desc" },
  });

  console.log("products:", products);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Product</h1>

      {/* ================= FORM ================= */}
      <div>
        <form
          action={createCategory}
          className="border p-4 space-y-3 max-w-md mb-10"
        >
          <input
            name="name"
            placeholder="Nama Kategori"
            className="border p-2 w-full"
            required
          />
          <input
            name="slug"
            placeholder="Slug (contoh: ruang tamu)"
            className="border p-2 w-full"
            required
          />
          <button className="bg-black text-white px-4 py-2 w-full">
            Simpan Kategori
          </button>
        </form>

        <form
          action={createColor}
          className="border p-4 space-y-3 max-w-md mb-10"
        >
          <input
            name="name"
            placeholder="Nama Kategori"
            className="border p-2 w-full"
            required
          />
          <input
            name="hex"
            placeholder="Hex (contoh: #FF0000)"
            className="border p-2 w-full"
            required
          />
          <button className="bg-black text-white px-4 py-2 w-full">
            Simpan Warna
          </button>
        </form>

        <form
          action={createSize}
          className="border p-4 space-y-3 max-w-md mb-10"
        >
          <input
            name="name"
            placeholder="Nama Size"
            className="border p-2 w-full"
            required
          />
          <button className="bg-black text-white px-4 py-2 w-full">
            Simpan Kategori
          </button>
        </form>

        <form action={createProduct} className="border p-4 space-y-3 max-w-md">
          <input
            name="name"
            placeholder="Nama Produk"
            className="border p-2 w-full"
            required
          />

          <input
            name="slug"
            placeholder="Slug (contoh: baskom-plastik)"
            className="border p-2 w-full"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Harga"
            className="border p-2 w-full"
            required
          />

          <textarea
            name="description"
            placeholder="Deskripsi singkat produk"
            className="border p-2 w-full"
          />

          <textarea
            name="details"
            placeholder="Detail produk (bahan, ukuran, dll)"
            className="border p-2 w-full"
          />

          <textarea
            name="highlights"
            placeholder="Highlights (pisahkan dengan enter)"
            className="border p-2 w-full"
          />

          <select
            name="categoryId"
            className="border p-2 w-full"
            defaultValue=""
          >
            <option value="">Pilih Kategori (optional)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            name="image"
            type="file"
            accept="image/*"
            className="border p-2 w-full"
            multiple
            required
          />

          {/* Pilih Color */}
          <div>
            <label className="font-medium">Warna:</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <label key={color.id} className="flex items-center gap-1">
                  <input type="checkbox" name="colors" value={color.id} />
                  <span>{color.name} </span>
                  <div
                    className="h-5 w-5 rounded-full border"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                </label>
              ))}
            </div>
          </div>

          {/* Pilih Size */}
          <div>
            <label className="font-medium">Ukuran:</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <label key={size.id} className="flex items-center gap-1">
                  <input type="checkbox" name="sizes" value={size.id} />
                  <span>{size.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="bg-black text-white px-4 py-2 w-full">
            Simpan Product
          </button>
        </form>
      </div>

      {/* ================= LIST PRODUCT ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-3 space-y-2">
            <img
              src={product.images[0]?.src}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="font-medium">{product.name}</div>
            <div className="text-sm">Rp {product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
