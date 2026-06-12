export const dynamic = "force-dynamic";
import FormLogin from "@/app/login/form-login";

export default function LoginPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="w-full border shadow-md border-gray-200 rounded-xl max-w-md bg-white p-8 sm:p-10 relative z-10 flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase italic">
            PERABOTAN
          </h1>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-2">
            Masuk akun
          </p>
        </div>

        <FormLogin />
      </div>
    </section>
  );
}
