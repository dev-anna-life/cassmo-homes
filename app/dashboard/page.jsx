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
  const username = session.user.username;
  const referralLink = `${origin}/${username}`;

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
          <div className="flex flex-col items-end text-right">
            <span className="text-xs sm:text-sm text-white/70 font-semibold max-w-[120px] sm:max-w-none truncate">{session.user.name}</span>
            {session.user.username && (
              <span className="text-[10px] sm:text-xs text-white/40 font-mono truncate max-w-[120px] sm:max-w-none">@{session.user.username}</span>
            )}
          </div>
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

        <div className="bg-[#0B3D24] text-white rounded-lg p-6 shadow">
          <p className="text-[#FE8F01] text-xs font-semibold uppercase tracking-wider mb-1">Member Dashboard</p>
          <h1 className="text-2xl font-bold">
            Welcome, {session.user.name.split(" ")[0]}
          </h1>
          {session.user.username && (
            <p className="text-[#FE8F01]/80 text-sm font-mono mt-0.5">@{session.user.username}</p>
          )}
          <p className="text-white/60 text-sm mt-1">
            Share your invite link below to invite people to Cassmo Homes.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#0B3D24]" />
            <h2 className="font-bold text-gray-800 text-lg">Your Invite Link</h2>
          </div>

          <div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-2.5 mb-3 select-all break-all overflow-hidden">
              <span className="flex-1 text-xs text-gray-600 font-mono break-all truncate">
                {referralLink}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
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

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-800 mb-3">How to Invite Someone</h3>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#0B3D24] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <span className="text-gray-600">
                Copy your <strong>invite link</strong> above.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#0B3D24] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <span className="text-gray-600">
                Send the link to your friend via WhatsApp, SMS, or any platform.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#0B3D24] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <span className="text-gray-600">
                When they click the link and register, they will automatically be added under your account.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#FE8F01] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <span className="text-gray-600">
                Your referral tree grows, and so does your commission potential!
              </span>
            </li>
          </ol>
        </div>

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
