"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, CheckCircle } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const refCode = params.get("ref");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // If no referral code, we show a clean message card instead of a blank screen
  if (!refCode) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#e9ecef" }}>
        <div className="bg-[#0B3D24] text-white flex items-center justify-between px-5 py-3 shadow">
          <div className="font-serif italic text-xl tracking-wide text-[#FE8F01]">Cassmo Homes</div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex items-center justify-center mb-4 text-amber-500">
              <AlertTriangle className="w-16 h-16" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Invitation Required</h2>
            <p className="text-gray-500 text-sm mb-6">
              You need an official invitation link to join this private referral network. Please contact an existing member for their invite link.
            </p>
            <Link 
              href="/login" 
              className="inline-block w-full bg-[#0B3D24] text-white py-3 rounded font-semibold text-sm hover:bg-[#072c1a] transition-colors"
            >
              Go to Member Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, refCode }),
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
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#e9ecef" }}>
      {/* Top green bar matching login portal */}
      <div className="bg-[#0B3D24] text-white flex items-center justify-between px-5 py-3 shadow">
        <div className="font-serif italic text-xl tracking-wide text-[#FE8F01]">Cassmo Homes</div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Success Signup State */}
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
                className="block w-full bg-[#0B3D24] text-white py-3.5 rounded font-semibold text-sm hover:bg-[#072c1a] transition-colors"
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
                <h2 className="mt-4 text-lg font-bold text-gray-700">Create Account</h2>
                <div className="mt-3 bg-green-50 border border-green-100 text-green-700 text-xs py-1.5 px-3 rounded inline-block">
                  Invited by Sponsor: <strong className="font-mono">{refCode}</strong>
                </div>
              </div>

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter phone number"
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
                    "✦ REGISTER ACCOUNT"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-[#FE8F01] hover:underline font-semibold">
                  Sign in
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
