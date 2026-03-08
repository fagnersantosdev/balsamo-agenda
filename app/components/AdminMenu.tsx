"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Menu, 
  FileText, 
  Settings, 
  Lock, 
  Clock, 
  Sparkles, 
  Star, 
  LogOut,
  ChevronDown
} from "lucide-react";

export default function AdminMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function triggerPDF() {
    window.dispatchEvent(new Event("admin:exportPDF"));
    setOpen(false);
  }

  const menuItems = [
    { label: "Exportar PDF", icon: <FileText size={18} />, onClick: triggerPDF },
    { label: "Gerenciar Serviços", icon: <Sparkles size={18} />, href: "/admin/services" },
    { label: "Gerenciar Avaliações", icon: <Star size={18} />, href: "/admin/testimonials" },
    { label: "Gerenciar Horários", icon: <Clock size={18} />, href: "/admin/availability" },
    { label: "Alterar Senha", icon: <Lock size={18} />, href: "/admin/change-password" },
    { label: "Configurações", icon: <Settings size={18} />, href: "/admin/settings" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-2
          px-4 py-2.5
          rounded-2xl
          bg-[#1F3924]
          text-[#FFFEF9]
          shadow-lg shadow-[#1F3924]/20
          hover:bg-[#2a4d31]
          transition-all
          active:scale-95
        "
      >
        <Menu size={20} />
        <span className="hidden sm:block font-bold text-sm uppercase tracking-widest">Menu</span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown com Animação e Blur */}
      <div
        className={`
          absolute right-0 mt-3 w-64
          bg-white/95 backdrop-blur-md
          border border-[#8D6A93]/10
          rounded-[2rem]
          shadow-2xl shadow-[#8D6A93]/20
          z-[100]
          py-4 px-2
          transform transition-all duration-300 origin-top-right
          ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
        `}
      >
        <div className="space-y-1">
          {menuItems.map((item, idx) => (
            item.href ? (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[#1F3924] font-semibold text-sm hover:bg-[#F5F3EB] rounded-xl transition-colors group"
              >
                <span className="text-[#8D6A93] group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <button
                key={idx}
                onClick={item.onClick}
                className="flex items-center gap-3 w-full px-4 py-3 text-[#1F3924] font-semibold text-sm hover:bg-[#F5F3EB] rounded-xl transition-colors group"
              >
                <span className="text-[#8D6A93] group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.label}
              </button>
            )
          ))}

          <div className="my-2 border-t border-[#8D6A93]/10 mx-4" />

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Encerrar Sessão
          </button>
        </div>
      </div>
    </div>
  );
}