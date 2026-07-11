"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-4 py-12"
      style={{
        backgroundImage: "linear-gradient(rgba(11, 61, 36, 0.75), rgba(0, 0, 0, 0.85)), url('/images/car-dark.png')",
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
        {sent ? (
          /* Success state */
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-center border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-green-200 flex items-center justify-center bg-green-50">
                <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-gray-500 text-sm mb-6">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent. Please check your inbox.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              The link expires in <strong>1 hour</strong>.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B3D24] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          /* Form state */
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
              <h2 className="mt-4 text-xl font-bold text-[#0B3D24]">Forgot Password</h2>
              <p className="text-xs text-gray-600 mt-1">
                Enter your registered email and we&apos;ll send you a reset link.
              </p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50/90 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B3D24] text-white font-semibold py-3.5 text-sm hover:bg-[#072c1a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg mt-2 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-[#0B3D24] font-bold hover:underline">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
