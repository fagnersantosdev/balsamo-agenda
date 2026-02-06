"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Sparkles,
  Clock,
  MoreHorizontal,
  Settings,
  MessageSquare,
  FileText,
  X,
  LogOut,
  Lock
} from "lucide-react";

interface MenuButtonProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  isAction?: boolean;
}

export default function AdminMobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const triggerPDF = () => {
    setShowMore(false);
    window.dispatchEvent(new CustomEvent("admin:exportPDF"));
  };

  const isActive = (path: string) => pathname === path;

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) => (
  <Link
    href={href}
    className={`flex flex-col items-center justify-center flex-1 transition-all relative ${
      isActive(href) ? "text-[#8D6A93]" : "text-[#1F3924]/40"
    }`}
  >
    <Icon className={`w-6 h-6 ${isActive(href) ? "animate-pulse" : ""}`} />
    <span className="text-[10px] font-black uppercase tracking-widest mt-1">{label}</span>
    {isActive(href) && (
      <motion.div layoutId="activeTab" className="absolute -bottom-2 w-1 h-1 bg-[#8D6A93] rounded-full" />
    )}
  </Link>
);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#8D6A93]/10 lg:hidden z-[60] px-4 pb-6 pt-3 shadow-[0_-10px_30px_rgba(141,106,147,0.1)] rounded-t-[2.5rem]">
        <div className="flex justify-around items-center">
          <NavItem href="/admin" icon={CalendarDays} label="Agenda" />
          <NavItem href="/admin/services" icon={Sparkles} label="Serviços" />
          <NavItem href="/admin/availability" icon={Clock} label="Horários" />
          
          <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center justify-center flex-1 text-[#1F3924]/40"
          >
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Mais</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {showMore && (
          <div className="fixed inset-0 z-[70] flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="absolute inset-0 bg-[#1F3924]/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full bg-[#F5F3EB] rounded-t-[3rem] p-8 shadow-2xl"
            >
              {/* Handle de arraste visual */}
              <div className="w-12 h-1.5 bg-[#1F3924]/10 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-[#1F3924]">Menu Extra</h3>
                <button onClick={() => setShowMore(false)} className="p-2 bg-white rounded-full shadow-sm text-[#1F3924]/40">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <MenuButton icon={Settings} label="Configurações" href="/admin/settings" onClick={() => setShowMore(false)} />
                <MenuButton icon={MessageSquare} label="Avaliações" href="/admin/testimonials" onClick={() => setShowMore(false)} />
                <MenuButton icon={Lock} label="Segurança" href="/admin/change-password" onClick={() => setShowMore(false)} />
                <MenuButton icon={FileText} label="Exportar Relatório PDF" onClick={triggerPDF} isAction />
                
                <div className="my-2 border-t border-[#1F3924]/5" />
                
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/login";
                  }}
                  className="flex items-center gap-4 w-full p-4 rounded-2xl bg-red-50 text-red-600 font-bold transition-all active:scale-95"
                >
                  <LogOut size={20} /> <span>Sair do Painel</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuButton({ icon: Icon, label, href, onClick, isAction }: MenuButtonProps) {
  const content = (
    <>
      <div className={`p-2 rounded-lg ${isAction ? "bg-[#1F3924] text-white" : "bg-white text-[#8D6A93]"}`}>
        <Icon size={20} />
      </div>
      <span className="font-bold text-[#1F3924]">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="flex items-center gap-4 w-full p-2 rounded-2xl bg-white/50 hover:bg-white transition-all">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="flex items-center gap-4 w-full p-2 rounded-2xl bg-white/50 hover:bg-white transition-all">
      {content}
    </button>
  );
}