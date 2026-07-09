"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Star, Bath, Home, ChevronRight, Key, ShieldAlert, X } from "lucide-react";

function AdminDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";
  const currentAction = searchParams.get("action");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [newPassword, setNewPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState("");

  // Offline prospects mockup
  const [prospects, setProspects] = useState([
    { id: "p1", name: "Amara Okeke", phone: "08099887766", email: "amara@gmail.com", date: "2026-07-08" },
    { id: "p2", name: "Tunde Bakare", phone: "08122334455", email: "tunde@gmail.com", date: "2026-07-09" }
  ]);
  const [newProspect, setNewProspect] = useState({ name: "", phone: "", email: "" });

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Handle Form Submissions for Actions
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setModalError("Please select a member");
      return;
    }

    setModalLoading(true);
    setModalError("");
    setModalMessage("");

    try {
      const res = await fetch("/api/admin/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          action: currentAction,
          role: newRole,
          password: newPassword
        })
      });
      const d = await res.json();
      setModalLoading(false);

      if (d.error) {
        setModalError(d.error);
      } else {
        setModalMessage("Action completed successfully!");
        fetchUsers();
        // Clear forms
        setNewPassword("");
        setSelectedUser("");
      }
    } catch (err) {
      setModalLoading(false);
      setModalError("An unexpected error occurred.");
    }
  };

  const handleAddProspect = (e) => {
    e.preventDefault();
    if (!newProspect.name || !newProspect.email) return;
    setProspects([
      ...prospects,
      {
        id: Date.now().toString(),
        ...newProspect,
        date: new Date().toISOString().split("T")[0]
      }
    ]);
    setNewProspect({ name: "", phone: "", email: "" });
  };

  // Filters
  const filteredUsers = users.filter(user => {
    if (currentTab === "registered") return user.role === "user";
    if (currentTab === "admins") return user.role === "admin";
    return true; // "all"
  });

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
        <Home className="w-4 h-4 text-gray-500" />
        <span className="font-bold text-gray-800 text-2xl">Dashboard</span>
      </div>
      <div className="flex items-center gap-1 text-sm mb-6">
        <Home className="w-3 h-3 text-gray-400" />
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#0B3D24]">Dashboard</span>
        {currentTab !== "all" && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-[#FE8F01] capitalize">{currentTab} Members</span>
          </>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Registered Members */}
        <div className="flex bg-white shadow overflow-hidden">
          <div className="bg-[#0B3D24] w-24 flex items-center justify-center flex-shrink-0">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div className="p-4 flex flex-col justify-center">
            <div className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Registered Members</div>
            <div className="text-gray-900 font-bold text-lg mt-1">
              {loading ? "..." : `${users.filter(u => u.role === "user").length} Member(s)`}
            </div>
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="flex bg-white shadow overflow-hidden">
          <div className="bg-[#dc3545] w-24 flex items-center justify-center flex-shrink-0">
            <Star className="w-10 h-10 text-white fill-white" />
          </div>
          <div className="p-4 flex flex-col justify-center">
            <div className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Total Withdrawn</div>
            <div className="text-gray-900 font-bold text-lg mt-1">₦ 0</div>
          </div>
        </div>

        {/* Total Pending */}
        <div className="flex bg-white shadow overflow-hidden">
          <div className="bg-[#1e272e] w-24 flex items-center justify-center flex-shrink-0">
            <Bath className="w-10 h-10 text-white" />
          </div>
          <div className="p-4 flex flex-col justify-center">
            <div className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Total Pending Withdrawal</div>
            <div className="text-gray-900 font-bold text-lg mt-1">₦ 0</div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering: Prospects (Unregistered Members) */}
      {currentTab === "unregistered" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Prospect Form */}
          <div className="bg-white shadow p-6 lg:col-span-1 h-fit">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add Offline Lead</h2>
            <form onSubmit={handleAddProspect} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newProspect.name}
                  onChange={e => setNewProspect({ ...newProspect, name: e.target.value })}
                  placeholder="Lead name"
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded bg-gray-50 text-gray-800 focus:outline-none focus:border-[#0B3D24]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newProspect.email}
                  onChange={e => setNewProspect({ ...newProspect, email: e.target.value })}
                  placeholder="lead@example.com"
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded bg-gray-50 text-gray-800 focus:outline-none focus:border-[#0B3D24]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newProspect.phone}
                  onChange={e => setNewProspect({ ...newProspect, phone: e.target.value })}
                  placeholder="080..."
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded bg-gray-50 text-gray-800 focus:outline-none focus:border-[#0B3D24]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0B3D24] text-white py-2 rounded text-sm font-semibold hover:bg-[#072c1a] transition-colors"
              >
                Add Prospect
              </button>
            </form>
          </div>

          {/* Prospects Table */}
          <div className="bg-white shadow overflow-hidden lg:col-span-2">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Unregistered Members / Leads</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 font-bold text-gray-700">No</th>
                    <th className="px-5 py-4 font-bold text-gray-700">Name</th>
                    <th className="px-5 py-4 font-bold text-gray-700">Email</th>
                    <th className="px-5 py-4 font-bold text-gray-700">Phone</th>
                    <th className="px-5 py-4 font-bold text-gray-700">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((prospect, idx) => (
                    <tr key={prospect.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-gray-500">{idx + 1}</td>
                      <td className="px-5 py-4 font-medium text-gray-800">{prospect.name}</td>
                      <td className="px-5 py-4">{prospect.email}</td>
                      <td className="px-5 py-4">{prospect.phone || "—"}</td>
                      <td className="px-5 py-4 text-xs text-gray-400">{prospect.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Registered Members Table */
        <div className="bg-white shadow overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {currentTab === "admins" ? "Administrator Accounts" : "Registered Members"}
            </h2>
            <span className="text-xs font-semibold bg-[#FE8F01]/10 text-[#FE8F01] px-3 py-1 rounded-full uppercase tracking-wider">
              {currentTab}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 min-w-[500px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 font-bold text-gray-700 border-r border-gray-100">No</th>
                  <th className="px-5 py-4 font-bold text-gray-700 border-r border-gray-100">Username</th>
                  <th className="px-5 py-4 font-bold text-gray-700 border-r border-gray-100">Phone Number</th>
                  <th className="px-5 py-4 font-bold text-gray-700 border-r border-gray-100">Referral Code</th>
                  <th className="px-5 py-4 font-bold text-gray-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 border-2 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
                        Loading members...
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400 italic">
                      No members matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 border-r border-gray-100 text-gray-500">{idx + 1}</td>
                      <td className="px-5 py-4 border-r border-gray-100 font-medium text-gray-800">
                        {user.name}
                        {user.role === "admin" && (
                          <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 border-r border-gray-100">{user.phone || "—"}</td>
                      <td className="px-5 py-4 border-r border-gray-100">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs tracking-wider text-gray-700">
                          {user.referralCode}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dynamic Action Modals */}
      {(currentAction === "change-role" || currentAction === "change-password") && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#0B3D24] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                {currentAction === "change-role" ? (
                  <ShieldAlert className="w-5 h-5 text-[#FE8F01]" />
                ) : (
                  <Key className="w-5 h-5 text-[#FE8F01]" />
                )}
                {currentAction === "change-role" ? "Change Member Role" : "Change Member Password"}
              </h3>
              <button 
                onClick={() => router.push("/admin")}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {modalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {modalError}
                </div>
              )}
              {modalMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                  {modalMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Select Member</label>
                <select
                  required
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded bg-gray-50 text-gray-800 focus:outline-none focus:border-[#0B3D24]"
                >
                  <option value="">-- Select Member --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              {currentAction === "change-role" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Select Role</label>
                  <select
                    required
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded bg-gray-50 text-gray-800 focus:outline-none focus:border-[#0B3D24]"
                  >
                    <option value="user">User (Standard Member)</option>
                    <option value="admin">Admin (Full Dashboard Access)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Enter New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded bg-gray-50 text-gray-800 focus:outline-none focus:border-[#0B3D24]"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 bg-[#0B3D24] text-white text-sm font-medium hover:bg-[#072c1a] rounded transition-colors disabled:opacity-50"
                >
                  {modalLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-[#0B3D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
