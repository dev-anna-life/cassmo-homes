"use client";

import { Menu, User } from "lucide-react";

export default function AdminHeader({ toggleSidebar }) {
  return (
    <header className="bg-[#0B3D24] text-white flex items-center justify-between px-4 py-3 shadow-md z-40 relative">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-1 hover:bg-white/20 rounded-md transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 text-center font-serif italic text-2xl tracking-wide">
        Cassmo Admin
      </div>
      
      <div>
        <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <User className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
