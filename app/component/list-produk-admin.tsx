"use client";

import { useState } from "react";
import {
  Grid,
  List,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";
import { SearchBarAdmin } from "./search-bar";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  images: { src: string; alt: string | null }[];
  basePrice: number;
  category: { name: string } | null;
  sold: number;
}

export default function ProdukListAdmin({
  product,
}: {
  product: ProductCardProps[];
}) {
  const [viewMode, setViewMode] = useState("list");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Ruang Tamu", "Kamar Mandi", "Dapur", "Luar Ruangan"];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Manajemen Produk
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Kelola dan pantau semua produk perabotan
            </p>
          </div>
          <a
            href="/admin/tambah-produk"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            Tambah Produk
          </a>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-70">
            <div className="relative">
              <SearchBarAdmin />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer text-sm"
            >
              <option value="all">Semua Kategori</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-white shadow-sm"
                  : "hover:bg-slate-200"
              }`}
            >
              <Grid
                size={18}
                className={
                  viewMode === "grid" ? "text-slate-700" : "text-slate-500"
                }
              />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-white shadow-sm"
                  : "hover:bg-slate-200"
              }`}
            >
              <List
                size={18}
                className={
                  viewMode === "list" ? "text-slate-700" : "text-slate-500"
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {product.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-48 flex items-center justify-center mx-auto">
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 mb-1">
                  {product.category?.name || "No Category"}
                </p>
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-slate-800">
                    {formatPrice(product.basePrice)}
                  </p>
                  <span className="text-sm text-slate-500">
                    Terjual: {product.sold}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                    <Edit size={14} />
                    Edit
                  </button>
                  <button className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
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
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0].src}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-800">
                            {product.name}
                          </p>
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
                    <td className="p-4">{product.sold}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
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
    </main>
  );
}
