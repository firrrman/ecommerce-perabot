"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { createProduct } from "../../actions/product";
import { checkSlugExists } from "../../actions/slug-check";
import SubmitButton from "@/app/component/submit-button";
import TransitionLink from "@/app/component/transition-link";

type Category = { id: string; name: string };
type Color = { id: string; name: string; hex: string };
type Size = { id: string; name: string };

interface Props {
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  variantSection: React.ReactNode;
}

type SlugStatus = "idle" | "checking" | "available" | "taken";

export default function FormProductClient({ categories, colors, sizes, variantSection }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [takenByProduct, setTakenByProduct] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, startTransition] = useTransition();

  // ── Cek slug saat blur ───────────────────────────────────
  const handleSlugBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (!val) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    startTransition(async () => {
      const res = await checkSlugExists(val);
      if (res.exists) {
        setSlugStatus("taken");
        setTakenByProduct(res.productName ?? "");
        toast.error(`Slug "${val}" sudah digunakan oleh produk "${res.productName}". Silakan ganti slug.`, {
          toastId: "slug-taken",
        });
      } else {
        setSlugStatus("available");
        setTakenByProduct("");
      }
    });
  };

  // ── Handle submit form ───────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (slugStatus === "taken") {
      toast.error("Slug sudah digunakan. Harap ganti slug sebelum menyimpan.", { toastId: "slug-taken-submit" });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const slug = (formData.get("slug") as string)?.trim();

      // Pengecekan slug saat submit
      if (slug) {
        const check = await checkSlugExists(slug);
        if (check.exists) {
          setSlugStatus("taken");
          setTakenByProduct(check.productName ?? "");
          toast.error(`Slug "${slug}" sudah digunakan oleh produk "${check.productName}". Silakan ganti slug.`, {
            toastId: "slug-taken-submit-check",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const result = await createProduct(formData);
      if (result && "error" in result && result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      // Next.js Server Action redirect throws NEXT_REDIRECT, re-throw it so Next.js navigates
      if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
        throw err;
      }
      toast.error("Terjadi kesalahan saat menambahkan produk.");
      setIsSubmitting(false);
    }
  };

  // ── Slug input border color ──────────────────────────────
  const slugBorderClass =
    slugStatus === "taken"
      ? "border-red-400 focus:ring-red-400"
      : slugStatus === "available"
        ? "border-green-400 focus:ring-green-400"
        : "border-gray-300 focus:ring-orange-500";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Informasi Dasar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            placeholder="Contoh: Baskom Plastik"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        {/* Slug field dengan status indicator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="slug"
              placeholder="baskom-plastik"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent pr-9 transition-colors ${slugBorderClass}`}
              onBlur={handleSlugBlur}
              required
            />
            {/* Status icon */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">
              {slugStatus === "checking" && (
                <svg className="animate-spin w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {slugStatus === "available" && <span className="text-green-500">✓</span>}
              {slugStatus === "taken" && <span className="text-red-500">✗</span>}
            </span>
          </div>

          {/* Hint messages */}
          {slugStatus === "taken" && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span>⚠️</span>
              Slug ini sudah digunakan oleh &ldquo;<strong>{takenByProduct}</strong>&rdquo;
            </p>
          )}
          {slugStatus === "available" && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <span>✓</span> Slug tersedia, bisa digunakan.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga Jual <span className="text-red-500">*</span>
          </label>
          <input
            name="basePrice"
            type="number"
            placeholder="50000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stok <span className="text-red-500">*</span>
          </label>
          <input
            name="stock"
            type="number"
            placeholder="100"
            defaultValue="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga Modal / Cost Price <span className="text-red-500">*</span>
          </label>
          <input
            name="costPrice"
            type="number"
            placeholder="35000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Berat Produk <span className="text-red-500">*</span>
          </label>
          <input
            name="weight"
            type="number"
            placeholder="1000=1kg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            defaultValue=""
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Produk Unggulan */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            value="true"
            className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">Jadikan Produk Unggulan</span>
        </label>
      </div>

      {/* Deskripsi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
          <textarea
            name="description"
            placeholder="Deskripsi singkat produk..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Highlights</label>
        <textarea
          name="highlights"
          placeholder={"- Tahan lama\n- Mudah dibersihkan\n- Ramah lingkungan"}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Pisahkan setiap highlight dengan enter</p>
      </div>

      {/* Varian Produk (diteruskan dari server) */}
      {variantSection}

      {/* Upload Gambar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gambar Produk <span className="text-red-500">*</span>
        </label>
        <input
          name="image"
          type="file"
          accept="image/*"
          multiple
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Bisa upload beberapa gambar sekaligus</p>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || slugStatus === "taken"}
          className="flex-1 cursor-pointer bg-blueprimary hover:bg-blueprimary/90 disabled:bg-blueprimary/50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Menyimpan...
            </>
          ) : (
            "Tambah Produk"
          )}
        </button>
        <TransitionLink
          href="/admin/produk"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 border cursor-pointer px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          Batal
        </TransitionLink>
      </div>
    </form>
  );
}
