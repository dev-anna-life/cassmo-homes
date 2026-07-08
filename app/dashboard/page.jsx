"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && session?.user?.role === "admin") {
      router.replace("/admin");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const referralLink = `${window.location.origin}/signup?ref=${session.user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-forest text-cream relative overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-a h-72 w-72 bg-accent/10 top-10 -left-16" />
      <div className="orb orb-b h-96 w-96 bg-brand-green/10 bottom-0 right-0" />

      {/* Header */}
      <header className="relative z-10 border-b border-cream/10 bg-forest-deep/60 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/logo-white.png"
            alt="Cassmo Homes"
            width={140}
            height={40}
            className="h-9 w-auto"
          />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-cream/60 hidden sm:block">
            {session.user.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs font-semibold uppercase tracking-wider text-cream/50 hover:text-cream transition-colors border border-cream/20 px-4 py-2 hover:border-cream/40"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* Welcome */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-2">
            Member Dashboard
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            Welcome back,{" "}
            <span className="text-brand-green">{session.user.name.split(" ")[0]}</span>
          </h1>
          <p className="mt-3 text-cream/60">
            Share your unique referral link to invite people to Cassmo Homes.
          </p>
        </div>

        {/* Referral Link Card */}
        <div className="bg-white/5 border border-cream/10 p-8 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-cream/50 mb-1">
            Your Referral Code
          </p>
          <div className="font-display text-4xl font-bold text-accent tracking-widest mb-6">
            {session.user.referralCode}
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-cream/50 mb-2">
            Your Invite Link
          </p>
          <div className="flex items-center gap-3 bg-forest-deep/60 border border-cream/10 p-3 mb-4">
            <span className="flex-1 text-sm text-cream/70 truncate font-mono">
              {referralLink}
            </span>
            <button
              onClick={copyLink}
              className={`shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                copied
                  ? "bg-brand-green text-forest"
                  : "bg-accent text-forest-deep hover:bg-accent-dark"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="text-xs text-cream/40">
            Share this link with someone you want to invite. They can only join
            using your link.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-cream/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cream/50 mb-1">
              My Code
            </p>
            <p className="font-display text-2xl font-semibold text-cream">
              {session.user.referralCode}
            </p>
          </div>
          <div className="bg-white/5 border border-cream/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cream/50 mb-1">
              Status
            </p>
            <span className="inline-flex items-center gap-2 text-brand-green text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-brand-green" />
              Active Member
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
