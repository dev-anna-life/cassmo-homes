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
  const [form, setForm] = useState({ email: "", password: "" });
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
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Incorrect email or password. Please try again.");
      setCaptchaOk(false); // reset CAPTCHA on wrong credentials
    } else {
      const session = await getSession();
      const redirectTo = session?.user?.role === "admin" ? "/admin" : "/dashboard";
      setSuccessUrl(redirectTo);
      setSuccessName(session?.user?.name || "");
      setSuccessUsername(session?.user?.username || "");
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#e9ecef" }}>
      {/* Top green bar */}
      <div className="bg-[#0B3D24] text-white flex items-center justify-between px-5 py-3 shadow">
        <div className="font-serif italic text-xl tracking-wide text-[#FE8F01]">Cassmo Homes</div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Success Modal */}
          {success && (
            <div className="bg-white rounded-lg shadow-lg p-10 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-green-200 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-400" strokeWidth={1.5} />
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
                className="w-full bg-[#0B3D24] text-white py-3.5 rounded font-semibold text-sm hover:bg-[#072c1a] transition-colors"
              >
                {successUrl === "/admin" ? "Proceed To Admin Dashboard" : "Proceed To Your Dashboard"}
              </button>
            </div>
          )}

          {/* Login Form */}
          {!success && (
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
                <h2 className="mt-4 text-lg font-bold text-gray-700">Member Login</h2>
              </div>

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email"
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

                {/* Math CAPTCHA */}
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

              <p className="mt-6 text-center text-xs text-gray-400">
                Don&apos;t have an account?{" "}
                <span className="text-gray-500">You need an invitation link to join.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
