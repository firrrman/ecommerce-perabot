import { createSize } from "../actions/product";

export default function FormSize() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Tambah Ukuran</h2>
      </div>
      <form action={createSize} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Ukuran
          </label>
          <input
            name="name"
            placeholder="Contoh: Medium"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <button className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors">
          Simpan Ukuran
        </button>
      </form>
    </div>
  );
}
