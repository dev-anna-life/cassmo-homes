"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, User, Lock, Mail, Phone, CreditCard, Building2, Hash } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const refFromUrl = params.get("ref") || "";

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    refCode: refFromUrl,
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [referrer, setReferrer] = useState(null); // { name, username }
  const [refError, setRefError] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lookup referrer when refCode changes
  useEffect(() => {
    const code = form.refCode.trim().toUpperCase();
    if (code.length < 6) {
      setReferrer(null);
      setRefError(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/referrer?ref=${code}`);
        const data = await res.json();
        if (res.ok) {
          setReferrer(data);
          setRefError(null);
        } else {
          setReferrer(null);
          setRefError("Invalid referral code");
        }
      } catch {
        setReferrer(null);
        setRefError(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.refCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.refCode.trim()) {
      setError("Please enter a referral code to sign up.");
      setLoading(false);
      return;
    }

    if (!referrer) {
      setError("Please enter a valid referral code before continuing.");
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(form.accountNumber)) {
      setError("Account number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
          phone: form.phone,
          refCode: form.refCode.trim().toUpperCase(),
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          accountName: form.accountName,
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

                {/* Referral Code */}
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
                  {/* Referrer name banner */}
                  {referrer && (
                    <div className="mt-2 bg-green-50 border border-green-200 rounded px-3 py-2.5 flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#0B3D24] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {referrer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-green-800">Referred by: {referrer.name}</p>
                        {referrer.username && (
                          <p className="text-xs text-green-600">@{referrer.username}</p>
                        )}
                      </div>
                      <span className="ml-auto text-green-500 text-xs font-bold">✓ Valid</span>
                    </div>
                  )}
                  {refError && (
                    <p className="text-xs text-red-500 mt-1">{refError}</p>
                  )}
                </div>

                {/* Full Name */}
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

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                    <input
                      type="text"
                      required
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })
                      }
                      placeholder="choose_a_username"
                      className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50 font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers and underscores only</p>
                </div>

                {/* Email */}
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

                {/* Phone */}
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

                {/* Password */}
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

                {/* Banking details section — REQUIRED */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#0B3D24]" />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Bank Payout Details <span className="text-red-500">*</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 -mt-2">
                    Required for commission payments. These details will be used to pay you directly.
                  </p>

                  {/* Bank Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.bankName}
                      onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                      placeholder="e.g. Zenith Bank, GTBank, Access Bank"
                      className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50"
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={form.accountNumber}
                      onChange={(e) => setForm({ ...form, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      placeholder="10 digit account number"
                      className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50 font-mono tracking-widest"
                    />
                    {form.accountNumber && form.accountNumber.length < 10 && (
                      <p className="text-xs text-orange-500 mt-1">
                        {10 - form.accountNumber.length} more digit{10 - form.accountNumber.length !== 1 ? "s" : ""} needed
                      </p>
                    )}
                    {form.accountNumber.length === 10 && (
                      <p className="text-xs text-green-600 mt-1">✓ 10 digits entered</p>
                    )}
                  </div>

                  {/* Account Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.accountName}
                      onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                      placeholder="Exact name on your bank account"
                      className="w-full border border-gray-300 text-gray-800 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] transition-colors rounded bg-gray-50"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Must match exactly as it appears on your bank account
                    </p>
                  </div>
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
                    "CREATE ACCOUNT"
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
