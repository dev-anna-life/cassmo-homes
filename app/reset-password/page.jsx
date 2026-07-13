"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset link. Please request a new one.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(data.error || "Something went wrong. Please try again.");
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
      <div className="absolute top-6 left-6 z-10 hidden sm:block">
        <Link href="/" className="font-serif italic text-2xl tracking-wide text-[#FE8F01] drop-shadow-md">
          Cassmo Homes
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {success ? (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-center border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-green-200 flex items-center justify-center bg-green-50">
                <CheckCircle className="w-12 h-12 text-green-400" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Updated!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your password has been changed successfully. Redirecting you to login...
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#0B3D24] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#072c1a] transition-all shadow-md"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
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
              <h2 className="mt-4 text-xl font-bold text-[#0B3D24]">Set New Password</h2>
              <p className="text-xs text-gray-600 mt-1">
                Choose a strong password for your account.
              </p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50/90 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg backdrop-blur-sm">
                {error}
                {error.includes("expired") && (
                  <div className="mt-2">
                    <Link href="/forgot-password" className="text-[#0B3D24] font-bold hover:underline">
                      Request a new reset link
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Re-enter your password"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-[#0B3D24] text-white font-semibold py-3.5 text-sm hover:bg-[#072c1a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg mt-2 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
