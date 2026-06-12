"use client";

import { useState } from "react";
import { adminLoginAction } from "../actions/login";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await toast.promise(adminLoginAction(email, password), {
        pending: "Memverifikasi akun...",
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Login berhasil");
      router.push(res.redirectTo ?? "/login");
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-xs font-bold text-black uppercase tracking-wider"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border-2 border-gray-200 text-black text-sm rounded-xl focus:ring-0 focus:border-black block w-full pl-11 p-3.5 placeholder-gray-400 font-medium transition-all"
            placeholder="admin@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-xs font-bold text-black uppercase tracking-wider"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-white border-2 border-gray-200 text-black text-sm rounded-xl focus:ring-0 focus:border-black block w-full pl-11 pr-11 p-3.5 placeholder-gray-400 font-medium transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        <button
          type="submit"
          className="w-full text-white cursor-pointer bg-black hover:bg-gray-900 font-bold rounded-xl text-sm px-5 py-4 text-center mt-8 transition-all active:scale-[0.98] uppercase tracking-widest"
        >
          Sign in to Dashboard
        </button>
      </div>

    </form>
  );
}
