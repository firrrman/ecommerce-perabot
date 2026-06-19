"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { customerRegisterAction } from "@/app/actions/customer";
import { useCustomer } from "@/app/context/customer-context";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import Link from "next/link";

export default function CustomerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { customer, refreshCustomer } = useCustomer();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (customer) {
      router.replace(callbackUrl);
    }
  }, [customer, router, callbackUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);

      const res = await customerRegisterAction(formData);

      if (!res.success) {
        toast.error(res.message || "Registrasi gagal");
        setIsLoading(false);
        return;
      }

      toast.success("Registrasi berhasil!");
      await refreshCustomer();
      router.push(callbackUrl);
    } catch (error) {
      console.error("Register client error:", error);
      toast.error("Terjadi kesalahan, silakan coba lagi");
      setIsLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="w-full border shadow-md border-gray-200 rounded-xl max-w-md bg-white p-8 sm:p-10 relative z-10 flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase italic hover:opacity-85 transition-opacity">
              PERABOTAN
            </h1>
          </Link>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">
            Daftar Akun Customer Baru
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block mb-1.5 text-xs font-bold text-black uppercase tracking-wider"
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-2 border-gray-200 text-black text-sm rounded-xl focus:ring-0 focus:border-black block w-full pl-11 p-3.5 placeholder-gray-400 font-medium transition-all outline-none"
                placeholder="Nama Lengkap Anda"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1.5 text-xs font-bold text-black uppercase tracking-wider"
            >
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-2 border-gray-200 text-black text-sm rounded-xl focus:ring-0 focus:border-black block w-full pl-11 p-3.5 placeholder-gray-400 font-medium transition-all outline-none"
                placeholder="customer@example.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block mb-1.5 text-xs font-bold text-black uppercase tracking-wider"
            >
              No. Telepon
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border-2 border-gray-200 text-black text-sm rounded-xl focus:ring-0 focus:border-black block w-full pl-11 p-3.5 placeholder-gray-400 font-medium transition-all outline-none"
                placeholder="08xxxxxxxxxx"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1.5 text-xs font-bold text-black uppercase tracking-wider"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white border-2 border-gray-200 text-black text-sm rounded-xl focus:ring-0 focus:border-black block w-full pl-11 pr-11 p-3.5 placeholder-gray-400 font-medium transition-all outline-none"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-black transition-colors cursor-pointer"
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
            className="w-full text-white cursor-pointer bg-black hover:bg-gray-900 font-bold rounded-xl text-sm px-5 py-4 text-center mt-6 transition-all active:scale-[0.98] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Pendaftaran Diproses..." : "Daftar Akun"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 mt-2">
          Sudah memiliki akun?{" "}
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-bold text-black hover:underline"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
