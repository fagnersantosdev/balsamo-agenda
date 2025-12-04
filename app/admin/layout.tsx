"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminMobileNav from "../components/AdminMobileNav";
import Toast from "../components/Toast";
import "../globals.css";

// 🔹 Tipagem global do toast
declare global {
  interface Window {
    __adminToast?: (v: { message: string; type?: "success" | "error" }) => void;
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  // 🌿 registra o toast global
  useEffect(() => {
    window.__adminToast = setToast;
  }, []);

  return (
    <>
      {/* 🌿 TOAST GLOBAL */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          position="top"
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen flex bg-[#FFFEF9] relative">
        {/* Sidebar — apenas desktop */}
        <aside
          className="
            hidden lg:block
            w-64
            border-r border-[#D6A77A]/30
            bg-[#F5F3EB]/80
            backdrop-blur-sm
            px-5 py-8
            shadow-sm
          "
        >
          <AdminSidebar />
        </aside>

        {/* Conteúdo */}
        <main
          className="
            flex-1 
            w-full
            px-4 sm:px-6
            py-8 
            pb-32     /* 🔥 espaço maior para o menu fixo */
          "
        >
          {children}
        </main>

        {/* Menu mobile — fixo */}
        <div
          className="
            lg:hidden
            fixed
            bottom-0
            left-0
            w-full
            z-50
            bg-[#FFFEF9]
            border-t border-[#D6A77A]/40
            shadow-[0_-4px_12px_-3px_rgba(0,0,0,0.12)]
          "
        >
          <AdminMobileNav />
        </div>
      </div>
    </>
  );
}