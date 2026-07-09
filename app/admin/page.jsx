"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, Star, Bath, Home, ChevronRight } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then((d) => {
          setUsers(d.users || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-[#0f9d58] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-6 text-sm">
        <Home className="w-4 h-4 text-gray-500" />
        <span className="font-bold text-gray-800 text-2xl">Dashboard</span>
      </div>
      <div className="flex items-center gap-1 text-sm mb-6">
        <Home className="w-3 h-3 text-gray-400" />
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#0f9d58]">Dashboard</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Registered Members */}
        <div className="flex bg-white shadow overflow-hidden">
          <div className="bg-[#0f9d58] w-24 flex items-center justify-center flex-shrink-0">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div className="p-4 flex flex-col justify-center">
            <div className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Registered Members</div>
            <div className="text-gray-900 font-bold text-lg mt-1">
              {loading ? "..." : `${users.length} Member${users.length !== 1 ? "s" : ""}`}
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

      {/* Earning History / Members Table */}
      <div className="bg-white shadow overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Registered Members</h2>
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
                      <div className="h-5 w-5 border-2 border-[#0f9d58] border-t-transparent rounded-full animate-spin" />
                      Loading members...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 italic">
                    No members yet. Share your invite link to get started!
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 border-r border-gray-100 text-gray-500">{idx + 1}</td>
                    <td className="px-5 py-4 border-r border-gray-100 font-medium text-gray-800">{user.name}</td>
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
    </div>
  );
}
