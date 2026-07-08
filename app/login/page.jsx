"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const errorParam = params.get("error");
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(
    errorParam === "CredentialsSignin"
      ? "Incorrect email or password."
      : errorParam === "invitation"
      ? "You need a valid invitation link to create an account."
      : null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4 relative overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-a h-72 w-72 bg-accent/15 top-10 -left-16" />
      <div className="orb orb-b h-96 w-96 bg-brand-green/10 bottom-0 right-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/">
            <Image
              src="/images/logo-white.png"
              alt="Cassmo Homes"
              width={160}
              height={48}
              className="mx-auto h-12 w-auto"
            />
          </Link>
          <p className="mt-4 text-cream/60 text-sm">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white/5 border border-cream/10 backdrop-blur-sm p-8 rounded-sm">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream/60 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-cream/20 text-cream placeholder-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream/60 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-cream/20 text-cream placeholder-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-forest-deep font-semibold py-3.5 text-sm transition-all duration-300 hover:bg-accent-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed rounded-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-cream/40">
            Don&apos;t have an account?{" "}
            <span className="text-cream/60">
              You need an invitation link to join.
            </span>
          </p>
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
