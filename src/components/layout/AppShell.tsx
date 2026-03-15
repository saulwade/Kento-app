"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7fafc]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Menu size={22} />
        </button>
        <span className="ml-3 text-base font-bold text-gray-800">Kento</span>
      </div>

      <main className="lg:ml-60 min-h-screen">
        <div className="px-4 lg:px-8 py-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
