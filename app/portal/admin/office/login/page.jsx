"use client";

import { useState, useCallback, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
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
      
      // Redirect to the callbackUrl search param if it exists, otherwise /admin
      const callbackUrl = searchParams.get("callbackUrl") || "/admin";
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#e9ecef" }}>
      {/* Left green panel */}
      <div
        className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12"
        style={{ backgroundColor: "#0B3D24" }}
      >
        <Image
          src="/images/logo-white.png"
          alt="Cassmo Homes"
          width={200}
          height={70}
          className="h-14 w-auto object-contain mb-8"
        />
        <h1 className="text-white text-3xl font-bold text-center mb-3">
          Admin Portal
        </h1>
        <p className="text-white/50 text-sm text-center max-w-xs">
          Restricted access. Authorised personnel only.
        </p>
        <div className="mt-10 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#FE8F01]" />
          <span className="text-white/40 text-xs tracking-widest uppercase">Secured Area</span>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="md:hidden mb-8 text-center">
            <Image
              src="/images/logo-color.png"
              alt="Cassmo Homes"
              width={160}
              height={55}
              className="mx-auto h-10 w-auto object-contain"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[#0B3D24]" />
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                Sign In
              </h2>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  placeholder="Enter admin username"
                  autoComplete="username"
                  className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50"
                />
              </div>

              {/* CAPTCHA */}
              <MathCaptcha onVerified={handleCaptcha} />

              <button
                type="submit"
                disabled={loading || !captchaOk}
                className="w-full bg-[#0B3D24] text-white font-semibold py-3.5 text-sm hover:bg-[#072c1a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded mt-2"
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

          <p className="mt-4 text-center text-xs text-gray-400">
            Cassmo Homes Admin Portal &copy; {new Date().getFullYear()}
          </p>
        </div>
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
