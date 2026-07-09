"use client";

export default function AdminLayoutWrapper({ children }) {
  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans w-full">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
