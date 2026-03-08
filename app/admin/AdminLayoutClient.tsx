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

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  // 🌿 registra o toast global
  useEffect(() => {
  window.__adminToast = setToast;
  return () => {
    delete window.__adminToast;
  };
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
        <aside className="hidden lg:block w-64 border-r border-[#D6A77A]/30 bg-[#F5F3EB]/80 px-5 py-8">
          <AdminSidebar />
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 px-4 sm:px-6 py-8 pb-32">
          {children}
        </main>

        {/* Menu mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-[#FFFEF9] border-t border-[#D6A77A]/40">
          <AdminMobileNav />
        </div>
      </div>
    </>
  );
}
