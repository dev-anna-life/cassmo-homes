"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Paths where we don't want the default public website Navbar, Footer, WhatsApp button, or Scroll Progress
  const isAuthOrDashboard =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/portal/admin") ||
    pathname.startsWith("/dashboard");

  if (isAuthOrDashboard) {
    return (
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
    );
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
