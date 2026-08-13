"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { unifiedLoginAction } from "@/app/actions/login";
import { useCustomer } from "@/app/context/customer-context";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { customer, refreshCustomer } = useCustomer();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Redirect if customer is already logged in (upon initial page load)
  useEffect(() => {
    if (customer && !isLoading) {
      router.replace(callbackUrl);
    }
  }, [customer, router, callbackUrl, isLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await unifiedLoginAction(email, password);

      if (!res.success) {
        toast.error(res.message || "Email atau password salah");
        setIsLoading(false);
        return;
      }

      if (res.role === "CUSTOMER") {
        toast.success("Login berhasil!");
        await refreshCustomer();
        window.location.href = callbackUrl;
      } else {
        // Admin / Owner — redirect ke dashboard
        toast.success("Login berhasil!");
        window.location.href = res.redirectTo ?? "/";
      }
    } catch (error) {
      console.error("Login client error:", error);
      toast.error("Terjadi kesalahan, silakan coba lagi");
      setIsLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-blueprimary p-6 relative overflow-hidden font-sans">
      {/* Subtle grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Soft ambient lighting highlights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 flex flex-col gap-4">

        {/* Card Box */}
        <div className="w-full border border-gray-100 shadow-2xl rounded-2xl bg-whiteprimary p-8 sm:p-10 flex flex-col gap-6">
          {/* Header & Logo */}
          <div className="text-center flex flex-col items-center gap-3">
            <Link href="/" className="inline-flex flex-col items-center gap-2 group">
              <div className="w-40 sm:w-52  flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/perabotan.png"
                  alt="Logo Perabotan"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
            </Link>
            <p className="text-xs font-bold text-blackrimary uppercase tracking-widest mt-1">
              Masuk ke Akun Anda
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-1.5 text-xs font-bold text-blackprimary uppercase tracking-wider"
              >
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail className="w-5 h-5 text-blueprimary" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-whiteprimary border-2 border-slate-200 text-blackprimary text-sm rounded-xl focus:ring-2 focus:ring-blueprimary/20 focus:border-blueprimary block w-full pl-11 p-3.5 placeholder-gray-400 font-medium transition-all outline-none"
                  placeholder="email@contoh.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1.5 text-xs font-bold text-blackprimary uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="w-5 h-5 text-blueprimary" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-whiteprimary border-2 border-slate-200 text-blackprimary text-sm rounded-xl focus:ring-2 focus:ring-blueprimary/20 focus:border-blueprimary block w-full pl-11 pr-11 p-3.5 placeholder-gray-400 font-medium transition-all outline-none"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-blackprimary transition-colors cursor-pointer"
                  disabled={isLoading}
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
              disabled={isLoading}
              className="w-full text-whiteprimary cursor-pointer bg-blueprimary hover:bg-blackprimary font-bold rounded-xl text-sm px-5 py-4 text-center mt-6 transition-all active:scale-[0.98] uppercase tracking-widest shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-2 border-t border-slate-100">
            Belum memiliki akun?{" "}
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-bold text-blueprimary hover:text-blackprimary hover:underline transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
