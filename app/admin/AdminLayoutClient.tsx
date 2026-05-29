"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminMobileNav from "../components/AdminMobileNav";
import Toast from "../components/Toast";


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

      {/* 👇 Adicionamos overflow-x-hidden nesta linha para "cortar" as borboletas */}
      <div className="min-h-screen flex bg-[#FFFEF9] relative overflow-x-hidden">
        
        {/* Sidebar — apenas desktop */}
        <aside className="hidden lg:block w-64 border-r border-[#D6A77A]/30 bg-[#F5F3EB]/80 px-5 py-8 print:hidden">
          <AdminSidebar />
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-8 pb-32">
          {children}
        </main>

        {/* Menu mobile */}
        {/* 👇 Adicionamos uma sombra (shadow) para destacar o menu sobre o conteúdo */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-[#FFFEF9] border-t border-[#D6A77A]/40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] print:hidden">
          <AdminMobileNav />
        </div>
        
      </div>
    </>
  );
}
