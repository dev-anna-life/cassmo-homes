import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";

export const metadata = {
  title: "Admin Dashboard — Cassmo Homes",
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    // This replaces the body content completely — no site Navbar/Footer shown
    <div className="admin-root" style={{ position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto" }}>
      <AdminLayoutWrapper session={session}>
        {children}
      </AdminLayoutWrapper>
    </div>
  );
}
