"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const refFromUrl = params.get("ref") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    refCode: refFromUrl, // Pre-fill if link has code, but user can type it too
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.refCode.trim()) {
      setError("Please enter a referral code to sign up.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          refCode: form.refCode.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#e9ecef" }}>
      {/* Top header bar */}
      <div className="bg-[#0B3D24] text-white flex items-center px-5 py-3 shadow">
        <div className="font-serif italic text-xl tracking-wide text-[#FE8F01]">Cassmo Homes</div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Success State */}
          {success ? (
            <div className="bg-white rounded-lg shadow-lg p-10 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-green-200 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-400" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Registration Successful!</h2>
              <p className="text-gray-400 text-sm mb-8">Your account has been created. You can now log in.</p>
              <Link
                href="/login"
                className="block w-full bg-[#0B3D24] text-white py-3.5 rounded font-semibold text-sm hover:bg-[#072c1a] transition-colors text-center"
              >
                Proceed to Login
              </Link>
            </div>
          ) : (
            /* Registration Form */
            <div className="bg-white rounded-lg shadow-lg p-8">
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
                <h2 className="mt-4 text-lg font-bold text-gray-700">Create Your Account</h2>
                <p className="text-xs text-gray-400 mt-1">You need a referral code from an existing member</p>
              </div>

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Referral Code — shown at the top so it's clear */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Referral / Invite Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.refCode}
                    onChange={(e) => setForm({ ...form, refCode: e.target.value.toUpperCase() })}
                    placeholder="Enter your invite code (e.g. AB12CD34)"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50 font-mono tracking-widest"
                  />
                  {refFromUrl && (
                    <p className="text-xs text-green-600 mt-1">✓ Invite code pre-filled from your link</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Phone Number <span className="text-gray-400 font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 08012345678"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B3D24] text-white font-semibold py-3.5 text-sm hover:bg-[#072c1a] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed rounded mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "✦ CREATE ACCOUNT"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-[#FE8F01] hover:underline font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
