"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  MonitorSmartphone, 
  FileText, 
  PieChart, 
  CreditCard, 
  Briefcase, 
  Banknote, 
  List, 
  FilePlus, 
  LogOut,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminSidebar({ isOpen, setIsOpen, session }) {
  const [openMenus, setOpenMenus] = useState({ members: false });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin", isDropdown: false },
    { 
      name: "Members", 
      icon: MonitorSmartphone, 
      id: "members",
      isDropdown: true,
      children: [
        { name: "Change Member Roles", href: "/admin?action=change-role" },
        { name: "Change Member Password", href: "/admin?action=change-password" },
        { name: "View All Members", href: "/admin?tab=all" },
        { name: "View Registered Members", href: "/admin?tab=registered" },
        { name: "View Unregistered Members", href: "/admin?tab=unregistered" },
      ]
    },
    { name: "Funding", icon: FileText, href: "#", isDropdown: false },
    { name: "Commissions", icon: FileText, href: "#", isDropdown: false },
    { name: "Bank Details", icon: PieChart, href: "#", isDropdown: false },
    { name: "Property Sales", icon: CreditCard, href: "#", isDropdown: false },
    { name: "Withdrawal", icon: Banknote, href: "#", isDropdown: false },
    { name: "Properties", icon: List, href: "#", isDropdown: false },
    { name: "Extras", icon: FilePlus, href: "#", isDropdown: false },
  ];

  return (
    <AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? "280px" : "0px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed lg:relative lg:block h-full bg-[#1e272e] text-gray-300 z-40 overflow-y-auto whitespace-nowrap overflow-x-hidden shadow-xl
          ${isOpen ? "block" : "hidden"}
        `}
      >
        <div className="w-[280px]">
          {/* User Profile Area */}
          <div className="p-6 bg-[#2d3436]/50 border-b border-gray-700/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center overflow-hidden border-2 border-gray-600">
               <UserAvatarPlaceholder />
            </div>
            <div>
              <div className="font-semibold text-white text-lg">{session?.user?.name || "Admin User"}</div>
              <div className="text-sm text-gray-400 capitalize">{session?.user?.role || "Admin"}</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="py-4">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.isDropdown ? (
                    <div>
                      <button 
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between px-6 py-3 hover:bg-[#2d3436] transition-colors
                          ${openMenus[item.id] ? "bg-[#2d3436] text-white border-l-4 border-[#FE8F01]" : "border-l-4 border-transparent"}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 opacity-80" />
                          <span>{item.name}</span>
                        </div>
                        {openMenus[item.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      
                      {/* Dropdown Children */}
                      <AnimatePresence>
                        {openMenus[item.id] && (
                          <motion.ul 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[#151c20] overflow-hidden"
                          >
                            {item.children.map(child => (
                              <li key={child.name}>
                                <a href={child.href} className="flex items-center gap-3 pl-14 pr-6 py-3 text-sm hover:text-white hover:bg-white/5 transition-colors">
                                  <div className="w-2 h-2 rounded-full border-2 border-gray-500" />
                                  {child.name}
                                </a>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a 
                      href={item.href}
                      className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#2d3436] transition-colors hover:text-white border-l-4 border-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 opacity-80" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </a>
                  )}
                </li>
              ))}

              {/* Logout Button */}
              <li>
                <button 
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#2d3436] hover:text-red-400 transition-colors border-l-4 border-transparent mt-4"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 opacity-80" />
                    <span>Logout</span>
                  </div>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function UserAvatarPlaceholder() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full pt-2">
      <path d="M50 50C61.0457 50 70 41.0457 70 30C70 18.9543 61.0457 10 50 10C38.9543 10 30 18.9543 30 30C30 41.0457 38.9543 50 50 50Z" fill="#D1D5DB"/>
      <path d="M85.8 88.5C85.8 72.8 73.1 60 57.3 60H42.7C26.9 60 14.2 72.8 14.2 88.5" stroke="#D1D5DB" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
