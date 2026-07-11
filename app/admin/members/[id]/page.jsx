"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  CreditCard,
  Users,
  Home,
  Phone,
  Mail,
  MapPin,
  Hash,
  Calendar,
  Shield,
} from "lucide-react";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function DetailRow({ label, value, mono }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap w-36">
        {label}
      </td>
      <td
        className={`py-3 px-4 text-sm text-gray-800 ${mono ? "font-mono" : "font-medium"}`}
      >
        {value || <span className="text-gray-400 italic text-xs">Not provided</span>}
      </td>
    </tr>
  );
}

export default function MemberProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "admin") return;

    async function fetchMember() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        const found = data.users?.find((u) => u.id === userId);
        if (found) {
          setMember(found);
        } else {
          setError("Member not found.");
        }
      } catch {
        setError("Failed to load member data.");
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [status, session, userId]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <Link href="/admin" className="text-[#0B3D24] underline text-sm">
            ← Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  if (!member) return null;

  const referredByName = member.referredBy
    ? member.referredBy.name
    : "Direct (no referrer)";

  const tabs = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "bank", label: "Bank Details", icon: CreditCard },
    { id: "downlines", label: "Downlines", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#0B3D24] text-white px-6 py-4 flex items-center gap-4 shadow">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <User className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">{member.name}</h1>
            {member.username && (
              <p className="text-xs text-white/50 font-mono">@{member.username}</p>
            )}
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="ml-auto flex items-center gap-2 text-xs text-white/40">
          <Home className="w-3.5 h-3.5" />
          <span>/</span>
          <Link href="/admin" className="hover:text-white/70">Dashboard</Link>
          <span>/</span>
          <span className="text-white/60">Member Profile</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Member Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0B3D24]/10 flex items-center justify-center flex-shrink-0 border-2 border-[#0B3D24]/20">
            <span className="text-2xl font-bold text-[#0B3D24]">
              {member.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{member.name}</h2>
            {member.username && (
              <p className="text-sm text-gray-400 font-mono">@{member.username}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-2">
              {member.memberNumber && (
                <span className="inline-flex items-center gap-1 text-xs bg-[#0B3D24]/10 text-[#0B3D24] font-bold px-2.5 py-1 rounded-full">
                  <Hash className="w-3 h-3" />
                  Member #{member.memberNumber}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full border border-green-200">
                <Shield className="w-3 h-3" />
                Active Member
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                Joined {fmtDate(member.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right text-xs text-gray-400">
            {member.referralCode && (
              <span>
                Referral Code:{" "}
                <strong className="font-mono text-gray-700">{member.referralCode}</strong>
              </span>
            )}
            <span>
              {member.referredUsers?.length || 0} Downline
              {member.referredUsers?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#0B3D24] text-white shadow"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Tab: Personal Details */}
        {activeTab === "personal" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0B3D24]" />
              <h3 className="font-bold text-gray-800">{member.username || member.name} — Personal Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <DetailRow label="Username" value={member.username ? `@${member.username}` : undefined} mono />
                  <DetailRow label="Full Name" value={member.name} />
                  <DetailRow label="Email" value={member.email} mono />
                  <DetailRow label="Phone" value={member.phone} mono />
                  <DetailRow label="Address" value={member.address} />
                  <DetailRow label="Referred By" value={referredByName} />
                  <DetailRow label="Member #" value={member.memberNumber ? `#${member.memberNumber}` : undefined} />
                  <DetailRow label="Referral Code" value={member.referralCode} mono />
                  <DetailRow label="Joined" value={fmtDate(member.createdAt)} />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Bank Details */}
        {activeTab === "bank" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#0B3D24]" />
              <h3 className="font-bold text-gray-800">
                {member.username || member.name} — Bank Details
              </h3>
            </div>
            {member.bankName || member.accountNumber || member.accountName ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Bank Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Account Number</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Account Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-4 text-sm text-gray-800 font-medium">{member.bankName || <span className="text-gray-400 italic text-xs">Not set</span>}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 font-mono">{member.accountNumber || <span className="text-gray-400 italic text-xs">Not set</span>}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 font-medium">{member.accountName || <span className="text-gray-400 italic text-xs">Not set</span>}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center">
                <CreditCard className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm italic">No bank details on file for this member.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Downlines */}
        {activeTab === "downlines" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0B3D24]" />
                <h3 className="font-bold text-gray-800">
                  {member.username || member.name} — Downlines
                </h3>
              </div>
              <span className="text-xs bg-[#0B3D24]/10 text-[#0B3D24] font-bold px-2.5 py-1 rounded-full">
                {member.referredUsers?.length || 0} Member{member.referredUsers?.length !== 1 ? "s" : ""}
              </span>
            </div>
            {member.referredUsers?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-600 min-w-[500px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">No</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Username</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {member.referredUsers.map((u, i) => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          {u.username ? `@${u.username}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{u.phone || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center">
                <Users className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm italic">This member hasn't referred anyone yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
