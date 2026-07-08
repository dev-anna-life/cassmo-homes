"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function StatCard({ label, value, color = "accent" }) {
  const colorMap = {
    accent: "text-accent",
    green: "text-brand-green",
    cream: "text-cream",
  };
  return (
    <div className="bg-white/5 border border-cream/10 p-6 flex items-center gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-cream/50 mb-1">
          {label}
        </p>
        <p className={`font-display text-3xl font-bold ${colorMap[color]}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function UserRow({ user, baseUrl }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const link = `${baseUrl}/signup?ref=${user.referralCode}`;

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <tr className="border-b border-cream/5 hover:bg-white/5 transition-colors">
        {/* Name / Email */}
        <td className="px-4 py-4">
          <p className="font-semibold text-cream text-sm">{user.name}</p>
          <p className="text-cream/50 text-xs mt-0.5">{user.email}</p>
          {user.phone && (
            <p className="text-cream/40 text-xs mt-0.5">{user.phone}</p>
          )}
        </td>

        {/* Referral Code */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-accent text-sm font-semibold tracking-wider">
              {user.referralCode}
            </span>
            <button
              onClick={copy}
              title="Copy invite link"
              className="text-xs text-cream/40 hover:text-accent transition-colors"
            >
              {copied ? "✓" : "⧉"}
            </button>
          </div>
          {user.role === "admin" && (
            <span className="text-xs text-accent/60 font-semibold">Admin</span>
          )}
        </td>

        {/* Referred By */}
        <td className="px-4 py-4">
          {user.referredBy ? (
            <span className="text-sm text-cream/70">{user.referredBy.name}</span>
          ) : (
            <span className="text-xs text-cream/30 italic">—</span>
          )}
        </td>

        {/* Referred Users */}
        <td className="px-4 py-4">
          {user.referredUsers.length > 0 ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm text-brand-green hover:text-accent transition-colors"
            >
              <span className="bg-brand-green/20 text-brand-green text-xs font-bold px-2 py-0.5 rounded-full">
                {user.referredUsers.length}
              </span>
              <span className="text-xs">{expanded ? "Hide ▲" : "Show ▼"}</span>
            </button>
          ) : (
            <span className="text-xs text-cream/30 italic">None yet</span>
          )}
        </td>

        {/* Date */}
        <td className="px-4 py-4 text-xs text-cream/50">
          {new Date(user.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </td>
      </tr>

      {/* Expandable referred users */}
      {expanded && user.referredUsers.length > 0 && (
        <tr className="bg-white/[0.02]">
          <td colSpan={5} className="px-8 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-cream/40 mb-2">
              Referred by {user.name}:
            </p>
            <div className="flex flex-wrap gap-2">
              {user.referredUsers.map((r) => (
                <span
                  key={r.id}
                  className="text-xs bg-brand-green/10 border border-brand-green/20 text-brand-green px-3 py-1 rounded-full"
                >
                  {r.name}
                </span>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then((d) => {
          setUsers(d.users || []);
          setLoading(false);
        });
    }
  }, [status, session]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const adminUser = users.find((u) => u.role === "admin");
  const adminLink = adminUser
    ? `${baseUrl}/signup?ref=${adminUser.referralCode}`
    : null;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.referralCode.toLowerCase().includes(search.toLowerCase())
  );

  const members = users.filter((u) => u.role === "user");

  const copyAdmin = () => {
    if (adminLink) {
      navigator.clipboard.writeText(adminLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-forest text-cream relative overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-a h-72 w-72 bg-accent/10 -top-10 -left-16" />
      <div className="orb orb-b h-96 w-96 bg-brand-green/10 bottom-0 right-0" />

      {/* Header */}
      <header className="relative z-10 border-b border-cream/10 bg-forest-deep/60 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/images/logo-white.png"
              alt="Cassmo Homes"
              width={140}
              height={40}
              className="h-9 w-auto"
            />
          </Link>
          <span className="hidden sm:block text-xs font-semibold uppercase tracking-widest text-accent border-l border-cream/10 pl-4">
            Admin Dashboard
          </span>
        </div>
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

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Page Title */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-1">
            Cassmo Homes
          </p>
          <h1 className="font-display text-3xl font-semibold">
            Referral Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Registered Members"
            value={members.length}
            color="green"
          />
          <StatCard
            label="Total in Network"
            value={users.length}
            color="accent"
          />
          <StatCard
            label="Chains Started"
            value={users.filter((u) => u.referredUsers.length > 0).length}
            color="cream"
          />
        </div>

        {/* Admin Invite Link */}
        {adminLink && (
          <div className="bg-accent/10 border border-accent/30 p-5 mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
              🔗 Your Master Invite Link — Share this with the first person
            </p>
            <div className="flex items-center gap-3">
              <span className="flex-1 font-mono text-sm text-cream/80 truncate bg-forest-deep/40 px-3 py-2 border border-cream/10">
                {adminLink}
              </span>
              <button
                onClick={copyAdmin}
                className={`shrink-0 px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  copied
                    ? "bg-brand-green text-forest"
                    : "bg-accent text-forest-deep hover:bg-accent-dark"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name, email or referral code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-white/10 border border-cream/20 text-cream placeholder-cream/30 px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
          />
          <span className="text-xs text-cream/40 shrink-0">
            {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-cream/10 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-cream/10 bg-white/5">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-cream/50">
                  Member
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-cream/50">
                  Referral Code
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-cream/50">
                  Referred By
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-cream/50">
                  Referred
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-cream/50">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-cream/40">
                    <div className="h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading members...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-cream/40 text-sm">
                    {search ? "No results found." : "No members yet. Share your invite link to get started!"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <UserRow key={user.id} user={user} baseUrl={baseUrl} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
