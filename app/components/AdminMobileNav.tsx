"use client";

import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Wrench,
  Clock,
  MessageSquare,
  FileText,
} from "lucide-react";


export default function AdminMobileNav() {
  const pathname = usePathname();

  function triggerPDF() {
    window.dispatchEvent(new CustomEvent("admin:exportPDF"));
  }

  function isActive(path: string) {
    return pathname === path;
  }

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        bg-[#F5F3EB]/95 backdrop-blur-lg
        border-t border-[#8D6A93]/30
        rounded-t-2xl
        shadow-[0_-4px_18px_rgba(0,0,0,0.15)]
        z-50
        lg:hidden
        px-2
        py-2
      "
    >
      <div className="flex justify-evenly items-center">

        {/* Agendamentos */}
        <button
          onClick={() => (window.location.href = "/admin")}
          className={`flex flex-col items-center ${
            isActive("/admin")
              ? "text-[#1F3924] font-semibold"
              : "text-[#1F3924]/60"
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[11px] mt-1">Agendamentos</span>
        </button>

        {/* Serviços */}
        <button
          onClick={() => (window.location.href = "/admin/services")}
          className={`flex flex-col items-center ${
            isActive("/admin/services")
              ? "text-[#1F3924] font-semibold"
              : "text-[#1F3924]/60"
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[11px] mt-1">Serviços</span>
        </button>

        {/* Horários */}
        <button
          onClick={() => (window.location.href = "/admin/availability")}
          className={`flex flex-col items-center ${
            isActive("/admin/availability")
              ? "text-[#1F3924] font-semibold"
              : "text-[#1F3924]/60"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[11px] mt-1">Horários</span>
        </button>

        {/* Avaliações */}
        <button
          onClick={() => (window.location.href = "/admin/testimonials")}
          className={`flex flex-col items-center  ${
            isActive("/admin/testimonials")
              ? "text-[#1F3924] font-semibold"
              : "text-[#1F3924]/60"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[11px] mt-1">Avaliações</span>
        </button>

        {/* Exportar */}
        <button
          onClick={triggerPDF}
          className="
            flex flex-col items-center
            text-[#8D6A93]
            hover:text-[#1F3924]
            transition
          "
        >
          <FileText className="w-5 h-5" />
          <span className="text-[11px] mt-1">Exportar</span>
        </button>

      </div>
    </nav>
  );
}
