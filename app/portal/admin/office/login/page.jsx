"use client";

import { useState, useCallback, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Shield } from "lucide-react";
import MathCaptcha from "@/components/MathCaptcha";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captchaOk, setCaptchaOk] = useState(false);

  const handleCaptcha = useCallback((ok) => setCaptchaOk(ok), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaOk) {
      setError("Please complete the security check first.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email: form.identifier,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Incorrect credentials. Please try again.");
      setCaptchaOk(false);
    } else {
      const session = await getSession();
      if (session?.user?.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        return;
      }
      
      const callbackUrl = searchParams.get("callbackUrl") || "/admin";
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-4 py-12"
      style={{
        backgroundImage: "linear-gradient(rgba(11, 61, 36, 0.65), rgba(0, 0, 0, 0.8)), url('/images/flyer-freedom.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top Left Logo Mark */}
      <div className="absolute top-6 left-6 z-10 hidden sm:block">
        <Link href="/" className="font-serif italic text-2xl tracking-wide text-[#FE8F01] drop-shadow-md">
          Cassmo Homes
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
          
          {/* Logo */}
          <div className="mb-6 text-center">
            <Link href="/">
              <Image
                src="/images/logo-color.png"
                alt="Cassmo Homes"
                width={180}
                height={60}
                className="mx-auto h-12 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center justify-center gap-1.5 mt-4 text-[#0B3D24]">
              <Shield className="w-5 h-5 text-[#FE8F01]" />
              <h2 className="text-xl font-bold uppercase tracking-wider">
                Admin Office
              </h2>
            </div>
            <p className="text-xs text-gray-600 mt-1">Authorized personnel only</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50/90 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                placeholder="Enter admin username"
                autoComplete="username"
                className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
              />
            </div>

            {/* CAPTCHA */}
            <MathCaptcha onVerified={handleCaptcha} />

            <button
              type="submit"
              disabled={loading || !captchaOk}
              className="w-full bg-[#0B3D24] text-white font-semibold py-3.5 text-sm hover:bg-[#072c1a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg mt-2 shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/50 tracking-wider">
          Cassmo Homes Admin Portal &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
