"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users, Home, ChevronRight, Key, ShieldAlert, X, Plus, Trash2,
  CheckCircle, XCircle, Building2, Banknote, PiggyBank, BarChart3,
  CreditCard, FileText, Info,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

/* ─────────────────────────────────── helpers ─────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n || 0);
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function Badge({ status }) {
  const map = {
    pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved:  "bg-green-50  text-green-700  border-green-200",
    completed: "bg-green-50  text-green-700  border-green-200",
    rejected:  "bg-red-50    text-red-700    border-red-200",
    cancelled: "bg-red-50    text-red-700    border-red-200",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border capitalize ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <Icon className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="text-sm italic">{message}</p>
    </div>
  );
}

/* ══════════════════════════════════ SECTION: DASHBOARD ═══════════════════ */
function DashboardSection({ users, dashData, loadingDash, onRefresh, session }) {
  const members = users.filter((u) => u.role === "user");
  const counts = dashData?.counts || {};
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError("");
    const res = await fetch("/api/admin/users/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: deleteTarget.id }),
    });
    const data = await res.json();
    setDeleteLoading(false);
    if (res.ok) {
      setDeleteTarget(null);
      onRefresh();
    } else {
      setDeleteError(data.error || "Failed to delete member.");
    }
  };

  const copyInvite = () => {
    if (!session?.user?.referralCode) return;
    const url = `${window.location.origin}/signup?ref=${session.user.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cards = [
    { label: "Registered Members", value: loadingDash ? "…" : `${members.length} Member(s)`, icon: Users, color: "bg-[#0B3D24]" },
    { label: "Total Withdrawn", value: loadingDash ? "…" : fmt(counts.totalWithdrawn), icon: Banknote, color: "bg-red-500" },
    { label: "Pending Withdrawal", value: loadingDash ? "…" : fmt(counts.pendingWithdrawals), icon: PiggyBank, color: "bg-gray-800" },
    { label: "Pending Funding", value: loadingDash ? "…" : fmt(counts.pendingFunding), icon: CreditCard, color: "bg-blue-600" },
    { label: "Total Sales", value: loadingDash ? "…" : fmt(counts.totalSales), icon: BarChart3, color: "bg-[#FE8F01]" },
  ];

  return (
    <div>
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Delete Member?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded p-3 mb-4">
              You are about to permanently delete <strong>{deleteTarget.name}</strong> and all their data.
            </p>
            {deleteError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(""); }}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded font-semibold text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 text-white py-2.5 rounded font-semibold text-sm hover:bg-red-700 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionHeader title="Dashboard" subtitle="Overview of all activity on Cassmo Homes." />

      {/* Admin Referral Link Banner */}
      {session?.user?.referralCode && (
        <div className="bg-white rounded shadow p-5 border-l-4 border-[#0B3D24] mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Your Admin Referral Details</h3>
            <p className="text-xs text-gray-500 mt-1">
              Copy your direct referral link below to register new members under your network.
            </p>
            <div className="mt-2 text-xs font-mono text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2 select-all break-all max-w-xl">
              {`${typeof window !== "undefined" ? window.location.origin : "https://cassmo-homes.vercel.app"}/signup?ref=${session.user.referralCode}`}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Referral Code: <span className="font-bold text-gray-600 font-mono tracking-wider">{session.user.referralCode}</span>
            </div>
          </div>
          <button
            onClick={copyInvite}
            className={`sm:self-center px-5 py-2.5 rounded font-semibold text-xs transition-colors self-start whitespace-nowrap ${
              copied ? "bg-green-600 text-white" : "bg-[#0B3D24] hover:bg-[#072c1a] text-white"
            }`}
          >
            {copied ? "✓ Copied Link" : "Copy Invite Link"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="flex bg-white shadow overflow-hidden rounded">
            <div className={`${c.color} w-20 flex items-center justify-center flex-shrink-0`}>
              <c.icon className="w-8 h-8 text-white" />
            </div>
            <div className="p-4 flex flex-col justify-center">
              <div className="text-gray-500 font-semibold text-xs uppercase tracking-wide">{c.label}</div>
              <div className="text-gray-900 font-bold text-lg mt-1">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Members Table */}
      <div className="bg-white rounded shadow">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Registered Members</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 min-w-[550px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3 font-bold text-gray-700">No</th>
                <th className="px-5 py-3 font-bold text-gray-700">Name</th>
                <th className="px-5 py-3 font-bold text-gray-700">Phone</th>
                <th className="px-5 py-3 font-bold text-gray-700">Referred By</th>
                <th className="px-5 py-3 font-bold text-gray-700">Joined</th>
                <th className="px-5 py-3 font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.slice(0, 10).map((u, i) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">
                    <div>
                      <div>{u.name}</div>
                      {u.username && <div className="text-xs text-gray-400 font-mono">@{u.username}</div>}
                    </div>
                  </td>
                  <td className="px-5 py-3">{u.phone || ""}</td>
                  <td className="px-5 py-3">{u.referredBy?.name || <span className="text-gray-400 italic text-xs">Direct</span>}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{fmtDate(u.createdAt)}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setDeleteTarget({ id: u.id, name: u.name })}
                      title="Delete member"
                      className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 px-2.5 py-1.5 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════ SECTION: MEMBERS ═════════════════════ */
function MembersSection({ users, loading, action, onRefresh }) {
  const [expandedUsers, setExpandedUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [newPassword, setNewPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState("");
  const [newMember, setNewMember] = useState({ name: "", email: "", password: "", phone: "" });
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const toggleExpand = (id) =>
    setExpandedUsers((prev) => ({ ...prev, [id]: !prev[id] }));

  const members = users.filter((u) => u.role !== "admin");

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError("");
    const res = await fetch("/api/admin/users/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: deleteTarget.id }),
    });
    const data = await res.json();
    setDeleteLoading(false);
    if (res.ok) {
      setDeleteTarget(null);
      onRefresh();
    } else {
      setDeleteError(data.error || "Failed to delete member.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) { setModalError("Please select a member"); return; }
    setModalLoading(true); setModalError(""); setModalMessage("");
    const res = await fetch("/api/admin/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser, newRole, newPassword }),
    });
    const data = await res.json();
    setModalLoading(false);
    if (res.ok) { setModalMessage("✅ Updated successfully!"); onRefresh(); }
    else setModalError(data.error || "Failed to update");
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setModalLoading(true); setModalError(""); setModalMessage("");
    const res = await fetch("/api/admin/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    });
    const data = await res.json();
    setModalLoading(false);
    if (res.ok) {
      setModalMessage("✅ Member added successfully!");
      setNewMember({ name: "", email: "", password: "", phone: "" });
      onRefresh();
    } else {
      setModalError(data.error || "Failed to add member");
    }
  };

  if (action === "add-member") {
    return (
      <div>
        <SectionHeader title="Add New Member" subtitle="Manually create a member account." />
        <div className="bg-white rounded shadow max-w-lg p-6">
          {modalMessage && <div className="mb-4 text-green-700 bg-green-50 border border-green-200 p-3 rounded text-sm">{modalMessage}</div>}
          {modalError && <div className="mb-4 text-red-700 bg-red-50 border border-red-200 p-3 rounded text-sm">{modalError}</div>}
          <form onSubmit={handleAddMember} className="space-y-4">
            {[["Full Name", "name", "text"], ["Email Address", "email", "email"], ["Password", "password", "password"], ["Phone (optional)", "phone", "tel"]].map(([label, field, type]) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">{label}</label>
                <input
                  type={type}
                  value={newMember[field]}
                  onChange={(e) => setNewMember({ ...newMember, [field]: e.target.value })}
                  required={field !== "phone"}
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]"
                />
              </div>
            ))}
            <button type="submit" disabled={modalLoading} className="w-full bg-[#0B3D24] text-white py-3 rounded font-semibold text-sm hover:bg-[#072c1a] disabled:opacity-60">
              {modalLoading ? "Creating…" : "Create Member"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (action === "change-role" || action === "change-password") {
    return (
      <div>
        <SectionHeader
          title={action === "change-role" ? "Change Member Role" : "Change Member Password"}
          subtitle="Select a member and apply the change."
        />
        <div className="bg-white rounded shadow max-w-lg p-6">
          {modalMessage && <div className="mb-4 text-green-700 bg-green-50 border border-green-200 p-3 rounded text-sm">{modalMessage}</div>}
          {modalError && <div className="mb-4 text-red-700 bg-red-50 border border-red-200 p-3 rounded text-sm">{modalError}</div>}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Select Member</label>
              <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]">
                <option value="">Choose a member</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            {action === "change-role" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">New Role</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]">
                  <option value="user">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            {action === "change-password" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} required className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]" placeholder="Minimum 8 characters" />
              </div>
            )}
            <button type="submit" disabled={modalLoading} className="w-full bg-[#0B3D24] text-white py-3 rounded font-semibold text-sm hover:bg-[#072c1a] disabled:opacity-60">
              {modalLoading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Default — view all members
  return (
    <div>
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Delete Member?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded p-3 mb-4">
              You are about to permanently delete <strong>{deleteTarget.name}</strong> and all their data (wallet, transactions, etc.).
            </p>
            {deleteError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(""); }}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded font-semibold text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 text-white py-2.5 rounded font-semibold text-sm hover:bg-red-700 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionHeader title="All Members" subtitle={`${members.length} registered member(s) in the network.`} />
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 font-bold text-gray-700">No</th>
              <th className="px-5 py-3 font-bold text-gray-700">Name</th>
              <th className="px-5 py-3 font-bold text-gray-700">Phone</th>
              <th className="px-5 py-3 font-bold text-gray-700">Referred By</th>
              <th className="px-5 py-3 font-bold text-gray-700">People Referred</th>
              <th className="px-5 py-3 font-bold text-gray-700">Joined</th>
              <th className="px-5 py-3 font-bold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading…</td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400 italic">No members yet.</td></tr>
            ) : (
              members.map((u, i) => (
                <React.Fragment key={u.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        {u.referredUsers?.length > 0 ? (
                          <button onClick={() => toggleExpand(u.id)} className="text-[#FE8F01] hover:bg-gray-200 rounded p-0.5">
                            <ChevronRight className={`w-4 h-4 transition-transform ${expandedUsers[u.id] ? "rotate-90" : ""}`} />
                          </button>
                        ) : <span className="w-6" />}
                        <div>
                          <div>{u.name}</div>
                          {u.username && <div className="text-xs text-gray-400 font-mono">@{u.username}</div>}
                        </div>
                        {u.role === "admin" && <span className="ml-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase">Admin</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">{u.phone || ""}</td>
                    <td className="px-5 py-3">{u.referredBy?.name || <span className="text-gray-400 italic text-xs">Direct</span>}</td>
                    <td className="px-5 py-3">
                      {u.referredUsers?.length > 0
                        ? <span className="bg-[#0B3D24]/10 text-[#0B3D24] text-xs font-bold px-2 py-0.5 rounded-full">{u.referredUsers.length} User(s)</span>
                        : <span className="text-gray-400 text-xs">0 Referrals</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{fmtDate(u.createdAt)}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setDeleteTarget({ id: u.id, name: u.name })}
                        title="Delete member"
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 px-2.5 py-1.5 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedUsers[u.id] && u.referredUsers?.length > 0 && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-10 py-4 border-b border-gray-100">
                        <div className="border-l-4 border-[#FE8F01] pl-4">
                          <p className="text-xs font-bold uppercase text-gray-500 mb-2">🔗 Referred by {u.name}:</p>
                          <div className="flex flex-wrap gap-2">
                            {u.referredUsers.map((r) => (
                              <div key={r.id} className="bg-white border border-gray-200 px-4 py-2 rounded shadow-sm">
                                <div className="font-semibold text-sm text-gray-800">{r.name}</div>
                                <div className="text-xs text-gray-400">{r.email}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════ SECTION: FUNDING ════════════════════ */
function FundingSection({ data, onRefresh }) {
  const [processing, setProcessing] = useState(null);

  const handleAction = async (requestId, status) => {
    setProcessing(requestId);
    await fetch("/api/admin/funding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status }),
    });
    setProcessing(null);
    onRefresh();
  };

  const requests = data?.fundingRequests || [];
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div>
      <SectionHeader title="Funding Requests" subtitle={`${pending} pending request(s) awaiting approval.`} />
      <div className="bg-white rounded shadow overflow-x-auto">
        {requests.length === 0 ? (
          <EmptyState icon={FileText} message="No funding requests yet." />
        ) : (
          <table className="w-full text-left text-sm text-gray-600 min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-bold text-gray-700">Member</th>
                <th className="px-5 py-3 font-bold text-gray-700">Amount</th>
                <th className="px-5 py-3 font-bold text-gray-700">Reference</th>
                <th className="px-5 py-3 font-bold text-gray-700">Date</th>
                <th className="px-5 py-3 font-bold text-gray-700">Status</th>
                <th className="px-5 py-3 font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800">{r.user.name}</div>
                    <div className="text-xs text-gray-400">{r.user.email}</div>
                  </td>
                  <td className="px-5 py-3 font-bold text-gray-800">{fmt(r.amount)}</td>
                  <td className="px-5 py-3 font-mono text-xs">{r.reference || ""}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{fmtDate(r.createdAt)}</td>
                  <td className="px-5 py-3"><Badge status={r.status} /></td>
                  <td className="px-5 py-3">
                    {r.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(r.id, "approved")} disabled={processing === r.id} className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 disabled:opacity-50">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => handleAction(r.id, "rejected")} disabled={processing === r.id} className="flex items-center gap-1 text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 disabled:opacity-50">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════ SECTION: COMMISSIONS ═════════════════ */
function CommissionsSection({ data }) {
  const sales = data?.sales || [];
  const total = sales.reduce((sum, s) => sum + s.commissionEarned, 0);

  return (
    <div>
      <SectionHeader title="Commissions" subtitle={`Total commissions earned: ${fmt(total)}`} />
      <div className="bg-white rounded shadow overflow-x-auto">
        {sales.length === 0 ? (
          <EmptyState icon={BarChart3} message="No sales recorded yet. Record a Property Sale to generate commissions." />
        ) : (
          <table className="w-full text-left text-sm text-gray-600 min-w-[620px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-bold text-gray-700">Agent Name</th>
                <th className="px-5 py-3 font-bold text-gray-700">Buyer Name</th>
                <th className="px-5 py-3 font-bold text-gray-700">Property</th>
                <th className="px-5 py-3 font-bold text-gray-700">Sale Price</th>
                <th className="px-5 py-3 font-bold text-gray-700">Commission</th>
                <th className="px-5 py-3 font-bold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{s.agent?.name || ""}</td>
                  <td className="px-5 py-3">{s.buyerName}</td>
                  <td className="px-5 py-3">{s.property?.title || ""}</td>
                  <td className="px-5 py-3">{fmt(s.price)}</td>
                  <td className="px-5 py-3 font-bold text-[#0B3D24]">{fmt(s.commissionEarned)}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{fmtDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════ SECTION: BANK DETAILS ═══════════════ */
function BankDetailsSection({ data }) {
  const bankDetails = data?.bankDetails || [];

  return (
    <div>
      <SectionHeader title="Bank Details" subtitle="Members' bank accounts for commission payouts." />
      <div className="bg-white rounded shadow overflow-x-auto">
        {bankDetails.length === 0 ? (
          <EmptyState icon={CreditCard} message="No bank details submitted by members yet." />
        ) : (
          <table className="w-full text-left text-sm text-gray-600 min-w-[560px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-bold text-gray-700">Member Name</th>
                <th className="px-5 py-3 font-bold text-gray-700">Bank</th>
                <th className="px-5 py-3 font-bold text-gray-700">Account Number</th>
                <th className="px-5 py-3 font-bold text-gray-700">Account Name</th>
              </tr>
            </thead>
            <tbody>
              {bankDetails.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-5 py-3">{u.bankName || ""}</td>
                  <td className="px-5 py-3 font-mono">{u.accountNumber || ""}</td>
                  <td className="px-5 py-3">{u.accountName || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════ SECTION: PROPERTY SALES ═════════════ */
function PropertySalesSection({ data, onRefresh }) {
  const [form, setForm] = useState({ buyerName: "", propertyId: "", agentId: "", customPrice: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const sales = data?.sales || [];
  const properties = data?.properties || [];
  // Get all non-admin users for agent selection
  const agents = (data?.bankDetails || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(""); setErr("");
    const res = await fetch("/api/admin/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg("✅ Sale recorded successfully! Commission credited to agent.");
      setForm({ buyerName: "", propertyId: "", agentId: "", customPrice: "" });
      onRefresh();
    } else {
      setErr(d.error || "Failed to record sale");
    }
  };

  return (
    <div className="space-y-8">
      {/* Record New Sale Form */}
      <div>
        <SectionHeader title="Property Sales" subtitle="Record a new property sale and automatically credit agent commission." />
        <div className="bg-white rounded shadow p-6 max-w-lg">
          {msg && <div className="mb-4 text-green-700 bg-green-50 border border-green-200 p-3 rounded text-sm">{msg}</div>}
          {err && <div className="mb-4 text-red-700 bg-red-50 border border-red-200 p-3 rounded text-sm">{err}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Buyer Name</label>
              <input type="text" value={form.buyerName} onChange={(e) => setForm({ ...form, buyerName: e.target.value })} required className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]" placeholder="Full name of buyer" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Property</label>
              <select value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} required className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]">
                <option value="">Select a property</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} | {fmt(p.price)} ({p.commissionRate}% comm.)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Agent (Member who made the sale)</label>
              <select value={form.agentId} onChange={(e) => setForm({ ...form, agentId: e.target.value })} required className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]">
                <option value="">Select agent</option>
                {agents.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Custom Sale Price (optional)</label>
              <input type="number" value={form.customPrice} onChange={(e) => setForm({ ...form, customPrice: e.target.value })} className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]" placeholder="Leave blank to use property default price" />
            </div>
            <button type="submit" disabled={saving} className="w-full bg-[#0B3D24] text-white py-3 rounded font-semibold text-sm hover:bg-[#072c1a] disabled:opacity-60">
              {saving ? "Recording…" : "✦ Record Sale & Credit Commission"}
            </button>
          </form>
        </div>
      </div>

      {/* Sales History */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Sales History</h3>
        <div className="bg-white rounded shadow overflow-x-auto">
          {sales.length === 0 ? (
            <EmptyState icon={Building2} message="No sales recorded yet." />
          ) : (
            <table className="w-full text-left text-sm text-gray-600 min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 font-bold text-gray-700">Buyer</th>
                  <th className="px-5 py-3 font-bold text-gray-700">Property</th>
                  <th className="px-5 py-3 font-bold text-gray-700">Agent</th>
                  <th className="px-5 py-3 font-bold text-gray-700">Sale Price</th>
                  <th className="px-5 py-3 font-bold text-gray-700">Commission</th>
                  <th className="px-5 py-3 font-bold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{s.buyerName}</td>
                    <td className="px-5 py-3">{s.property?.title || ""}</td>
                    <td className="px-5 py-3">{s.agent?.name || ""}</td>
                    <td className="px-5 py-3">{fmt(s.price)}</td>
                    <td className="px-5 py-3 font-bold text-[#0B3D24]">{fmt(s.commissionEarned)}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{fmtDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════ SECTION: WITHDRAWAL ══════════════════ */
function WithdrawalSection({ data, onRefresh }) {
  const [processing, setProcessing] = useState(null);

  const handleAction = async (requestId, status) => {
    setProcessing(requestId);
    await fetch("/api/admin/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status }),
    });
    setProcessing(null);
    onRefresh();
  };

  const requests = data?.withdrawalRequests || [];
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div>
      <SectionHeader title="Withdrawal Requests" subtitle={`${pending} pending request(s) awaiting payout.`} />
      <div className="bg-white rounded shadow overflow-x-auto">
        {requests.length === 0 ? (
          <EmptyState icon={Banknote} message="No withdrawal requests yet." />
        ) : (
          <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-bold text-gray-700">Member</th>
                <th className="px-5 py-3 font-bold text-gray-700">Amount</th>
                <th className="px-5 py-3 font-bold text-gray-700">Bank</th>
                <th className="px-5 py-3 font-bold text-gray-700">Account No.</th>
                <th className="px-5 py-3 font-bold text-gray-700">Date</th>
                <th className="px-5 py-3 font-bold text-gray-700">Status</th>
                <th className="px-5 py-3 font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800">{r.user.name}</div>
                    <div className="text-xs text-gray-400">{r.user.email}</div>
                  </td>
                  <td className="px-5 py-3 font-bold text-gray-800">{fmt(r.amount)}</td>
                  <td className="px-5 py-3">{r.bankName}</td>
                  <td className="px-5 py-3 font-mono">{r.accountNumber}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{fmtDate(r.createdAt)}</td>
                  <td className="px-5 py-3"><Badge status={r.status} /></td>
                  <td className="px-5 py-3">
                    {r.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(r.id, "completed")} disabled={processing === r.id} className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 disabled:opacity-50">
                          <CheckCircle className="w-3.5 h-3.5" /> Pay
                        </button>
                        <button onClick={() => handleAction(r.id, "cancelled")} disabled={processing === r.id} className="flex items-center gap-1 text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 disabled:opacity-50">
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════ SECTION: PROPERTIES ═════════════════ */
function PropertiesSection({ data, onRefresh }) {
  const [form, setForm] = useState({ title: "", location: "", price: "", commissionRate: "10", description: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [showForm, setShowForm] = useState(false);

  const properties = data?.properties || [];

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(""); setErr("");
    const res = await fetch("/api/admin/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg("✅ Property added successfully!");
      setForm({ title: "", location: "", price: "", commissionRate: "10", description: "" });
      setShowForm(false);
      onRefresh();
    } else setErr(d.error || "Failed to add property");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this property?")) return;
    setDeleting(id);
    await fetch("/api/admin/properties", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleting(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Properties" subtitle="Manage the list of properties available for sale." />
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#0B3D24] text-white px-4 py-2 rounded font-semibold text-sm hover:bg-[#072c1a]">
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      {msg && <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded text-sm">{msg}</div>}
      {err && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded text-sm">{err}</div>}

      {showForm && (
        <div className="bg-white rounded shadow p-6 max-w-xl">
          <h3 className="font-bold text-gray-800 mb-4">New Property</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]" placeholder="e.g. Cassmo Estate Phase 1" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]" placeholder="e.g. Asokoro, Abuja" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Price (₦)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]" placeholder="15000000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Commission Rate (%)</label>
                <input type="number" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: e.target.value })} required min="1" max="100" className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-300 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-[#0B3D24]" placeholder="Brief description of the property…" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="flex-1 bg-[#0B3D24] text-white py-3 rounded font-semibold text-sm hover:bg-[#072c1a] disabled:opacity-60">
                {saving ? "Saving…" : "Add Property"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {properties.length === 0 ? (
          <div className="col-span-3 bg-white rounded shadow">
            <EmptyState icon={Building2} message="No properties added yet. Click 'Add Property' to get started." />
          </div>
        ) : (
          properties.map((p) => (
            <div key={p.id} className="bg-white rounded shadow p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-gray-800">{p.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">📍 {p.location}</p>
                </div>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="text-red-400 hover:text-red-600 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xl font-bold text-[#0B3D24]">{fmt(p.price)}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#FE8F01]/10 text-[#FE8F01] font-semibold px-2 py-0.5 rounded">
                  {p.commissionRate}% Commission
                </span>
              </div>
              {p.description && <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>}
              <p className="text-xs text-gray-400">Added {fmtDate(p.createdAt)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════ SECTION: EXTRAS ══════════════════════ */
function ExtrasSection({ data, session }) {
  const [copied, setCopied] = useState(false);

  const copyInvite = () => {
    if (!session?.user?.referralCode) return;
    const url = `${window.location.origin}/signup?ref=${session.user.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="Extras" subtitle="Company materials and network settings." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0B3D24]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#0B3D24]" />
            </div>
            <h3 className="font-bold text-gray-800">Marketing Materials</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Upload official flyers, estate layouts, and brochures for members to download.</p>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">File upload will be available here</p>
          </div>
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#FE8F01]/10 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-[#FE8F01]" />
            </div>
            <h3 className="font-bold text-gray-800">Network Settings</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Default Commission Rate</span>
              <span className="font-bold text-gray-800">10%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Signup Mode</span>
              <span className="font-bold text-green-600">Invite Only</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Platform</span>
              <span className="font-bold text-gray-800">Cassmo Homes v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {session?.user?.referralCode && (
        <div className="bg-white rounded shadow p-6 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0B3D24]/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#0B3D24]" />
            </div>
            <h3 className="font-bold text-gray-800">Admin Invitation Details</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Use your referral code or direct link to register members under the Cassmo Homes network.
          </p>
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Referral Code</span>
              <span className="font-mono font-bold text-lg text-gray-800 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded select-all">
                {session.user.referralCode}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Referral Link</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/signup?ref=${session.user.referralCode}`}
                  className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 text-xs font-mono rounded text-gray-600 focus:outline-none"
                />
                <button
                  onClick={copyInvite}
                  className={`px-4 py-2 rounded text-xs font-semibold transition-colors ${
                    copied ? "bg-green-600 text-white" : "bg-[#0B3D24] hover:bg-[#072c1a] text-white"
                  }`}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════ ROOT PAGE ════════════════════════════ */
function AdminDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [section, setSection] = useState("dashboard");
  const [action, setAction] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [dashData, setDashData] = useState(null);
  const [loadingDash, setLoadingDash] = useState(true);

  const fetchAll = useCallback(() => {
    setLoadingUsers(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setLoadingUsers(false); })
      .catch(() => setLoadingUsers(false));

    setLoadingDash(true);
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { setDashData(d); setLoadingDash(false); })
      .catch(() => setLoadingDash(false));
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.replace("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") fetchAll();
  }, [status, session, fetchAll]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (session?.user?.role !== "admin") return null;

  const onNavigate = (sec, act = "") => {
    setSection(sec);
    setAction(act);
  };

  const renderSection = () => {
    switch (section) {
      case "dashboard":   return <DashboardSection users={users} dashData={dashData} loadingDash={loadingDash} onRefresh={fetchAll} session={session} />;
      case "members":     return <MembersSection users={users} loading={loadingUsers} action={action} onRefresh={fetchAll} />;
      case "funding":     return <FundingSection data={dashData} onRefresh={fetchAll} />;
      case "commissions": return <CommissionsSection data={dashData} />;
      case "bankdetails": return <BankDetailsSection data={dashData} />;
      case "sales":       return <PropertySalesSection data={dashData} onRefresh={fetchAll} />;
      case "withdrawals": return <WithdrawalSection data={dashData} onRefresh={fetchAll} />;
      case "properties":  return <PropertiesSection data={dashData} onRefresh={fetchAll} />;
      case "extras":      return <ExtrasSection data={dashData} session={session} />;
      default:            return <DashboardSection users={users} dashData={dashData} loadingDash={loadingDash} onRefresh={fetchAll} session={session} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5]">
      <AdminSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        session={session}
        currentSection={section}
        onNavigate={onNavigate}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
