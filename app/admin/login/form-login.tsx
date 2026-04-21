"use client";

import { useState } from "react";
import { adminLoginAction } from "../../actions/login";
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
      router.push("/admin/dashboard");
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Mail className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white"
            placeholder="admin@example.com"
            required
          />
        </div>
      </div>
      
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Lock className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 p-3 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full text-white cursor-pointer bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-3.5 text-center mt-8 transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
      >
        Sign in to Dashboard
      </button>
    </form>
  );
}
