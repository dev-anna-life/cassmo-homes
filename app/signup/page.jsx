"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, CreditCard } from "lucide-react";
import MathCaptcha from "@/components/MathCaptcha";

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
    address: "",
    refCode: refFromUrl,
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const [referrer, setReferrer] = useState(null);
  const [refError, setRefError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaOk, setCaptchaOk] = useState(false);

  const handleCaptcha = useCallback((ok) => setCaptchaOk(ok), []);

  const lookupReferrer = useCallback(async (code) => {
    if (!code) {
      setReferrer(null);
      setRefError(null);
      return;
    }
    try {
      const res = await fetch(`/api/auth/referrer?ref=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (res.ok) {
        setReferrer(data);
        setRefError(null);
      } else {
        setReferrer(null);
        setRefError("No active member found with this code or username.");
      }
    } catch {
      setReferrer(null);
      setRefError("Failed to lookup referral code.");
    }
  }, []);

  useEffect(() => {
    if (refFromUrl) {
      lookupReferrer(refFromUrl);
    }
  }, [refFromUrl, lookupReferrer]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.refCode && form.refCode !== refFromUrl) {
        lookupReferrer(form.refCode);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [form.refCode, refFromUrl, lookupReferrer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!referrer) {
      setError("You must have a valid referrer to sign up.");
      return;
    }
    if (!captchaOk) {
      setError("Please complete the security check first.");
      return;
    }

    setLoading(true);
    setError(null);

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
          address: form.address,
          refCode: referrer.referralCode,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          accountName: form.accountName,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setCaptchaOk(false);
      } else {
        setSuccess(true);
      }
    } catch {
      setLoading(false);
      setError("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-4 py-8"
      style={{
        backgroundImage: "linear-gradient(rgba(11, 61, 36, 0.75), rgba(0, 0, 0, 0.85)), url('/images/house-dusk.png')",
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

      <div className="w-full max-w-lg relative z-10 my-6">
        {/* Success State */}
        {success ? (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-center border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-green-200 flex items-center justify-center bg-green-50">
                <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Registration Successful!</h2>
            <p className="text-gray-400 text-sm mb-8">Your account has been created. You can now log in.</p>
            <Link
              href="/login"
              className="block w-full bg-[#0B3D24] text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-[#072c1a] active:scale-[0.98] transition-all text-center shadow-md"
            >
              Proceed to Login
            </Link>
          </div>
        ) : (
          /* Registration Form */
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
              <h2 className="mt-4 text-xl font-bold text-[#0B3D24]">Create Your Account</h2>
              <p className="text-xs text-gray-600 mt-1">You need a referral from an existing member</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50/90 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Referral Code / Username */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Referral Code or Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.refCode}
                  onChange={(e) => setForm({ ...form, refCode: e.target.value })}
                  placeholder="e.g. 1 or code"
                  className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70 font-mono tracking-widest"
                />
                {/* Referrer banner */}
                {referrer && (
                  <div className="mt-2 bg-green-50/90 border border-green-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0B3D24] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      #{referrer.memberNumber ?? "A"}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-800">
                        Referred by: {referrer.memberNumber ? `Member #${referrer.memberNumber}` : "Admin"}
                      </p>
                    </div>
                    <span className="ml-auto text-green-500 text-xs font-bold">✓ Valid</span>
                  </div>
                )}
                {refError && <p className="text-xs text-red-500 mt-1 font-semibold">{refError}</p>}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">@</span>
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })
                    }
                    placeholder="choose_a_username"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70 font-mono"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Lowercase letters, numbers and underscores only</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email address"
                  className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 08012345678"
                  className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your residential address"
                  className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70 resize-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
                />
              </div>

              {/* Banking details section */}
              <div className="pt-4 border-t border-gray-200/50 space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0B3D24]" />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Bank Payout Details <span className="text-red-500">*</span>
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 -mt-2">
                  Required for commission payments. These details will be used to pay you directly.
                </p>

                {/* Bank Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.bankName}
                    onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                    placeholder="e.g. Zenith Bank, GTBank"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
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
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70 font-mono tracking-widest"
                  />
                  {form.accountNumber && form.accountNumber.length < 10 && (
                    <p className="text-xs text-orange-600 mt-1">
                      {10 - form.accountNumber.length} more digit{10 - form.accountNumber.length !== 1 ? "s" : ""} needed
                    </p>
                  )}
                  {form.accountNumber.length === 10 && (
                    <p className="text-xs text-green-700 mt-1">✓ 10 digits entered</p>
                  )}
                </div>

                {/* Account Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.accountName}
                    onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                    placeholder="Exact name on your bank account"
                    className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-[#0B3D24] focus:ring-1 focus:ring-[#0B3D24] transition-all rounded-lg bg-white/70"
                  />
                </div>
              </div>

              {/* Math CAPTCHA */}
              <MathCaptcha onVerified={handleCaptcha} />

              <button
                type="submit"
                disabled={loading || !captchaOk}
                className="w-full bg-[#0B3D24] text-white font-semibold py-3.5 text-sm hover:bg-[#072c1a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg mt-2 shadow-md"
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

            <p className="mt-5 text-center text-xs text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0B3D24] hover:underline font-bold">
                Sign in here
              </Link>
            </p>
          </div>
        )}
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
