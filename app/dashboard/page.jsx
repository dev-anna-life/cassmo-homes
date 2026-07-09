"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, CheckCheck, LogOut, Users, Share2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && session?.user?.role === "admin") {
      router.replace("/admin");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#e9ecef" }}>
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://cassmo-homes.vercel.app";
  const referralLink = `${origin}/signup?ref=${session.user.referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(session.user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Cassmo Homes",
        text: `I'd like to invite you to join Cassmo Homes real estate network. Use my referral link to sign up!`,
        url: referralLink,
      });
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#e9ecef" }}>
      {/* Top Header */}
      <div className="bg-[#0B3D24] text-white flex items-center justify-between px-5 py-3 shadow">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/images/logo-white.png"
              alt="Cassmo Homes"
              width={130}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/70 hidden sm:block">{session.user.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-3 py-1.5 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-6">

        {/* Welcome Banner */}
        <div className="bg-[#0B3D24] text-white rounded-lg p-6 shadow">
          <p className="text-[#FE8F01] text-xs font-semibold uppercase tracking-wider mb-1">Member Dashboard</p>
          <h1 className="text-2xl font-bold">
            Welcome, {session.user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Share your referral code or link below to invite people to Cassmo Homes.
          </p>
        </div>

        {/* Referral Code Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#0B3D24]" />
            <h2 className="font-bold text-gray-800 text-lg">Your Referral Code</h2>
          </div>

          {/* Big Code Display */}
          <div className="bg-gray-50 border-2 border-dashed border-[#0B3D24]/30 rounded-lg p-6 text-center mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your Unique Code</p>
            <div className="font-mono text-4xl font-bold text-[#0B3D24] tracking-widest mb-4">
              {session.user.referralCode}
            </div>
            <button
              onClick={copyCode}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm transition-all ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-[#0B3D24] text-white hover:bg-[#072c1a]"
              }`}
            >
              {copied ? (
                <><CheckCheck className="w-4 h-4" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy Code</>
              )}
            </button>
          </div>

          {/* Full Invite Link */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Full Invite Link</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-2.5 mb-3">
              <span className="flex-1 text-xs text-gray-600 truncate font-mono">
                {referralLink}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded font-semibold text-sm border transition-all ${
                  copiedLink
                    ? "bg-green-500 text-white border-green-500"
                    : "border-[#0B3D24] text-[#0B3D24] hover:bg-[#0B3D24] hover:text-white"
                }`}
              >
                {copiedLink ? <><CheckCheck className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
              </button>
              <button
                onClick={shareLink}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded font-semibold text-sm bg-[#FE8F01] text-white hover:bg-[#e07e01] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Link
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-800 mb-3">How to Invite Someone</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#0B3D24] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              Copy your <strong>invite link</strong> or <strong>referral code</strong> above.
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#0B3D24] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              Send the link to your friend via WhatsApp, SMS, or any platform.
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#0B3D24] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              When they click the link and register, they will automatically be added under your account.
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#FE8F01] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              Your referral tree grows, and so does your commission potential!
            </li>
          </ol>
        </div>

        {/* Status badge */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Account Status</p>
            <p className="font-semibold text-gray-800 mt-0.5">{session.user.email}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Active Member
          </span>
        </div>

      </div>
    </div>
  );
}
