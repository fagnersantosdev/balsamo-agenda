"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  CalendarDays, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  Settings, 
  LogOut,
  //LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "Agendamentos", icon: CalendarDays },
    { href: "/admin/services", label: "Serviços", icon: Sparkles },
    { href: "/admin/testimonials", label: "Avaliações", icon: MessageSquare },
    { href: "/admin/availability", label: "Disponibilidade", icon: Clock },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full p-6 bg-white border-r border-[#8D6A93]/10">
      
      {/* Logo + Nome (Refinado) */}
      <div className="flex items-center gap-4 mb-10 px-2">
        <div className="relative">
          <Image
            src="/logo-balsamo.png"
            width={48}
            height={48}
            alt="Logo Bálsamo"
            className="rounded-2xl shadow-sm border border-[#8D6A93]/10 p-1 bg-[#F5F3EB]/30"
          />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1F3924]">
            Bálsamo
          </h2>
          <p className="text-[10px] font-bold text-[#8D6A93] uppercase tracking-widest">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300
                ${active 
                  ? "bg-[#1F3924] text-[#FFFEF9] shadow-lg shadow-[#1F3924]/20" 
                  : "text-[#1F3924]/60 hover:bg-[#F5F3EB] hover:text-[#1F3924]"
                }
              `}
            >
              <Icon size={20} className={active ? "text-[#D6A77A]" : "group-hover:scale-110 transition-transform"} />
              <span className={`text-sm font-bold tracking-tight ${active ? "opacity-100" : "opacity-80"}`}>
                {item.label}
              </span>

              {/* Indicador Ativo Lateral */}
              {active && (
                <motion.div 
                  layoutId="sidebarActive"
                  className="absolute left-0 w-1 h-6 bg-[#D6A77A] rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer da Sidebar / Sair */}
      <div className="pt-6 border-t border-[#8D6A93]/10">
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="
            flex items-center gap-3 w-full px-4 py-3 rounded-2xl
            text-red-500 font-bold text-sm
            hover:bg-red-50 transition-all group
          "
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Sair do Painel
        </button>
        
        <p className="mt-4 text-[9px] text-center text-[#1F3924]/30 font-black uppercase tracking-[0.3em]">
          v2.0 Beta • Bálsamo
        </p>
      </div>
    </div>
  );
}