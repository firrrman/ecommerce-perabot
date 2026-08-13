"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { Grid, List, ChevronDown, Edit, Trash2, Star, Package, Layers } from "lucide-react";
import { SearchBarAdmin } from "../../component/search-bar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/app/component/pagination";
import ConfirmModal from "@/app/component/confirm-modal";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import TransitionLink from "@/app/component/transition-link";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  stock: number;
  images: { src: string; alt: string | null }[];
  basePrice: number;
  category: { name: string } | null;
  sold: number;
  is_featured?: boolean;
  hasVariants?: boolean;
  variants?: {
    id: string;
    color?: { name: string; hex?: string } | null;
    size?: { name: string } | null;
    price?: number | null;
    stock: number;
    sold: number;
  }[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const VariantSummary = ({ variants, basePrice }: { variants: any[] | undefined, basePrice: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!variants || variants.length === 0) return null;

  return (
    <div className="mt-2.5 mb-2">
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
          isOpen 
            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Layers size={13} className={isOpen ? "text-white" : "text-indigo-500"} />
          <span>Lihat {variants.length} Variasi</span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="max-h-56 overflow-y-auto space-y-2 p-2 mt-2 bg-slate-50/80 border border-slate-200/60 rounded-xl custom-scrollbar">
          {variants.map((v) => {
            const hasColor = Boolean(v.color?.name);
            const hasSize = Boolean(v.size?.name);

            return (
              <div 
                key={v.id} 
                className="bg-white border border-slate-200/80 rounded-lg p-2.5 shadow-sm hover:border-indigo-200 transition-all flex flex-col gap-1.5"
              >
                {/* Variant Attributes & Price */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {hasColor && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100/60">
                        {v.color?.hex && (
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shrink-0" 
                            style={{ backgroundColor: v.color.hex }} 
                          />
                        )}
                        {v.color?.name}
                      </span>
                    )}
                    {hasSize && (
                      <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100/60">
                        Ukuran: {v.size?.name}
                      </span>
                    )}
                    {!hasColor && !hasSize && (
                      <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        Default
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {formatPrice(v.price || basePrice)}
                  </span>
                </div>

                {/* Variant Stock & Sold Stats */}
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 text-slate-500">
                  <div className="flex items-center gap-1">
                    <span>Stok:</span>
                    <span className={`font-bold ${v.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                      {v.stock} pcs
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Terjual:</span>
                    <span className="font-bold text-slate-700">{v.sold} pcs</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface Kategori {
  name: string;
  slug: string;
}

export default function ProdukListAdmin({
  categories,
  product,
  onDelete,
  page,
  search,
  category,
  produk,
}: {
  categories: Kategori[];
  product: ProductCardProps[];
  onDelete: (id: string) => void;
  page: number;
  search: string;
  category: string;
  produk: any;
}) {
  const [viewMode, setViewMode] = useState("list");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;

    setConfirmDeleteId(null);
    setIsDeletingId(id);

    try {
      await onDelete(id);
      location.reload();
    } catch {
      toast.error("Gagal menghapus produk");
      setIsDeletingId(null);
    }
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    window.dispatchEvent(new CustomEvent("start-navigation", { detail: "category" }));
    router.push(`?${params.toString()}`, { scroll: false });
  };



  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Produk
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Kelola katalog, stok, varian, dan info produk perabotan.
            </p>
          </div>
          <TransitionLink
            href="/admin/tambah-produk"
            className="bg-blueprimary hover:bg-blueprimary/90 cursor-pointer text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm shadow-md shadow-indigo-600/20"
          >
            + Tambah Produk
          </TransitionLink>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-blackprimary/30 p-4 flex flex-wrap gap-4 items-center shadow">
          {/* Search */}
          <div className="flex-1 min-w-70">
            <SearchBarAdmin />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 cursor-pointer text-sm font-semibold text-slate-700"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <ChevronDown
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl ml-auto border border-slate-200/60">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow-xs text-slate-900"
                  : "hover:bg-slate-200 text-slate-400 cursor-pointer"
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white shadow-xs text-slate-900"
                  : "hover:bg-slate-200 text-slate-400 cursor-pointer"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {product.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Tidak Ada Produk</h3>
          <p className="text-slate-500 max-w-sm">
            Belum ada produk yang ditambahkan atau produk yang Anda cari tidak ditemukan.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {product.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-blackprimary/30 shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-48 flex items-center justify-center mx-auto">
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {product.is_featured && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center gap-1 uppercase tracking-wide">
                    <Star size={10} fill="currentColor" /> Unggulan
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-slate-500">
                    {product.category?.name || "No Category"}
                  </p>
                  {product.hasVariants && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200">
                      Ada Variasi
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                {<VariantSummary variants={product.variants} basePrice={product.basePrice} />}
                <div className="flex items-center justify-between mb-3 mt-1">
                  <p className="text-lg font-bold text-slate-800">
                    {formatPrice(product.basePrice)}
                  </p>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-slate-500">
                      Stok: {product.stock}
                    </span>
                    <span className="text-sm text-slate-500">
                      Terjual: {product.sold}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/edit-produk/${product.id}`}
                    onClick={() => setEditingId(product.id)}
                    className="flex-1 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    {editingId === product.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Edit size={14} />
                    )}
                    {editingId === product.id ? "Memuat..." : "Edit"}
                  </Link>
                  <button
                    onClick={() => confirmDelete(product.id)}
                    disabled={isDeletingId === product.id}
                    className="bg-red-50 cursor-pointer hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isDeletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-blackprimary/30 shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-220 md:w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    No
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Harga Dasar
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Terjual
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {product?.map((product, index) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">{(page - 1) * 12 + index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0].src}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-medium text-slate-800 flex items-center gap-2 flex-wrap">
                            {product.name}
                            {product.is_featured && (
                              <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-yellow-200 flex items-center gap-1 whitespace-nowrap">
                                <Star size={10} fill="currentColor" /> Unggulan
                              </span>
                            )}
                            {product.hasVariants && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-blue-200 whitespace-nowrap">
                                Ada Variasi
                              </span>
                            )}
                          </p>
                          {<VariantSummary variants={product.variants} basePrice={product.basePrice} />}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600">
                        {product.category?.name || "No Category"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800">
                        {formatPrice(product.basePrice)}
                      </span>
                    </td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">{product.sold}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/edit-produk/${product.id}`}
                          onClick={() => setEditingId(product.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors text-blue-600 flex items-center justify-center"
                        >
                          {editingId === product.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Edit size={16} />
                          )}
                        </Link>
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg cursor-pointer transition-colors text-red-600 disabled:opacity-50"
                          title="Hapus"
                          disabled={isDeletingId === product.id}
                          onClick={() => confirmDelete(product.id)}
                        >
                          {isDeletingId === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Pagination
        product={produk}
        page={page}
        search={search}
        category={category}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Aksi ini tidak dapat dibatalkan."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
