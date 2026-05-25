"use client";

import { useState, useEffect } from "react";
import { adminLogoutAction } from "../actions/login";
import { LogOut, AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function Logout() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openConfirm = () => {
    setShowConfirm(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const closeConfirm = () => {
    setIsVisible(false);
    setTimeout(() => setShowConfirm(false), 300);
  };

  const handleLogout = async () => {
    closeConfirm();
    await adminLogoutAction();
  };

  return (
    <>
      <button
        type="button"
        onClick={openConfirm}
        className="w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-lg transition-all text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        <LogOut size={20} className="mr-3" />
        Keluar
      </button>

      {mounted && showConfirm &&
        createPortal(
          <div
            className={`fixed inset-0 z-9999 flex items-center justify-center p-4 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeConfirm}
            />

            {/* Modal Card — sama seperti ConfirmModal */}
            <div
              className={`bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden z-10 transform transition-all duration-300 ${
                isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <button
                    onClick={closeConfirm}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Konfirmasi Keluar
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Apakah Anda yakin ingin keluar?
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={closeConfirm}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
