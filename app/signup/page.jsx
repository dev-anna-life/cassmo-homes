"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
  const [loading, setLoading] = useState(false);

  // Redirect away if no referral code
  useEffect(() => {
    if (!refCode) {
      router.replace("/login?error=invitation");
    }
  }, [refCode, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      router.push("/login?message=Account created! Please sign in.");
    }
  };

  if (!refCode) return null;

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
            You&apos;ve been invited to join Cassmo Homes
          </p>
        </div>

        <div className="bg-white/5 border border-cream/10 backdrop-blur-sm p-8 rounded-sm">
          {/* Referral badge */}
          <div className="mb-6 flex items-center gap-2 bg-brand-green/10 border border-brand-green/30 px-4 py-2.5 rounded-sm">
            <span className="h-2 w-2 rounded-full bg-brand-green shrink-0" />
            <span className="text-xs text-brand-green font-medium">
              Invitation code: <strong>{refCode}</strong>
            </span>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream/60 mb-2">
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Adah John"
                className="w-full bg-white/10 border border-cream/20 text-cream placeholder-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream/60 mb-2">
                Email Address <span className="text-accent">*</span>
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
                Password <span className="text-accent">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                className="w-full bg-white/10 border border-cream/20 text-cream placeholder-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream/60 mb-2">
                Phone Number{" "}
                <span className="text-cream/30 font-normal normal-case">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+234 900 000 0000"
                className="w-full bg-white/10 border border-cream/20 text-cream placeholder-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-forest-deep font-semibold py-3.5 text-sm transition-all duration-300 hover:bg-accent-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed rounded-sm"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-cream/40">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
