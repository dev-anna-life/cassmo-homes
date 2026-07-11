"use client";

import { useState, Suspense, useCallback } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import MathCaptcha from "@/components/MathCaptcha";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const errorParam = params.get("error");
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState(
    errorParam === "CredentialsSignin"
      ? "Incorrect email or password."
      : errorParam === "invitation"
      ? "You need a valid invitation link to create an account."
      : null
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successUrl, setSuccessUrl] = useState("/dashboard");
  const [successName, setSuccessName] = useState("");
  const [successUsername, setSuccessUsername] = useState("");
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

    setLoading(true);

    if (res?.error) {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
      setCaptchaOk(false);
    } else {
      const session = await getSession();
      const redirectTo = session?.user?.role === "admin" ? "/admin" : "/dashboard";
      setSuccessUrl(redirectTo);
      setSuccessName(session?.user?.name || "");
      setSuccessUsername(session?.user?.username || "");
      setSuccess(true);
      setLoading(false);
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
        {/* Success Modal */}
        {success && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-center border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-green-200 flex items-center justify-center bg-green-50">
                <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Successful!</h2>
            {successUsername ? (
              <p className="text-gray-500 text-sm mb-1">
                Welcome back, <span className="font-semibold text-gray-700">{successName}</span>
              </p>
            ) : null}
            {successUsername ? (
              <p className="text-gray-400 text-xs mb-6">@{successUsername}</p>
            ) : (
              <p className="text-gray-400 text-sm mb-6">Login was Successful</p>
            )}
            <button
              onClick={() => {
                router.push(successUrl);
                router.refresh();
              }}
              className="w-full bg-[#0B3D24] text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-[#072c1a] active:scale-[0.98] transition-all"
            >
              {successUrl === "/admin" ? "Proceed To Admin Dashboard" : "Proceed To Your Dashboard"}
            </button>
          </div>
        )}

        {/* Login Form Container */}
        {!success && (
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
              <h2 className="mt-4 text-xl font-bold text-[#0B3D24]">Member Login</h2>
              <p className="text-xs text-gray-600 mt-1">Access your real estate referral account</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50/90 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  placeholder="Enter your email or username"
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
                    Signing in...
                  </span>
                ) : (
                  "SIGN IN"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs">
              <Link
                href="/forgot-password"
                className="text-[#0B3D24] font-bold hover:underline"
              >
                Forgot your password?
              </Link>
            </p>

            <p className="mt-3 text-center text-xs text-gray-600 border-t border-gray-200/50 pt-4">
              Don&apos;t have an account?{" "}
              <span className="text-gray-700 block mt-1 font-medium">You need an invitation link to join.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
