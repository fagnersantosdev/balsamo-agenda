"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Wrench,
  Clock,
  MoreHorizontal,
  Settings,
  MessageSquare,
  FileText,
  X,
} from "lucide-react";

export default function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  function triggerPDF() {
    setShowMore(false);
    window.dispatchEvent(new CustomEvent("admin:exportPDF"));
  }

  function isActive(path: string) {
    return pathname === path;
  }

  return (
    <>
      {/* =========================
          Bottom Navigation
      ========================== */}
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
            onClick={() => router.push("/admin")}
            className={`flex flex-col items-center ${
              isActive("/admin")
                ? "text-[#1F3924] font-semibold"
                : "text-[#1F3924]/60"
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-[11px] mt-1">Agenda</span>
          </button>

          {/* Serviços */}
          <button
            onClick={() => router.push("/admin/services")}
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
            onClick={() => router.push("/admin/availability")}
            className={`flex flex-col items-center ${
              isActive("/admin/availability")
                ? "text-[#1F3924] font-semibold"
                : "text-[#1F3924]/60"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[11px] mt-1">Horários</span>
          </button>

          {/* Mais */}
          <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center text-[#1F3924]/70"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[11px] mt-1">Mais</span>
          </button>

        </div>
      </nav>

      {/* =========================
          Bottom Sheet - Mais
      ========================== */}
      {showMore && (
        <div className="fixed inset-0 z-[60]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMore(false)}
          />

          {/* Sheet */}
          <div
            className="
              absolute bottom-0 left-0 right-0
              bg-[#F5F3EB]
              rounded-t-3xl
              p-5
              shadow-2xl
              animate-slideUp
            "
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#1F3924]">
                Mais opções
              </h3>
              <button onClick={() => setShowMore(false)}>
                <X className="w-5 h-5 text-[#1F3924]/60" />
              </button>
            </div>

            <div className="space-y-3">

              <button
                onClick={() => {
                  setShowMore(false);
                  router.push("/admin/settings");
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-white shadow-sm"
              >
                <Settings className="w-5 h-5 text-[#8D6A93]" />
                <span>Configurações</span>
              </button>

              <button
                onClick={() => {
                  setShowMore(false);
                  router.push("/admin/testimonials");
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-white shadow-sm"
              >
                <MessageSquare className="w-5 h-5 text-[#8D6A93]" />
                <span>Avaliações</span>
              </button>

              <button
                onClick={triggerPDF}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-white shadow-sm"
              >
                <FileText className="w-5 h-5 text-[#8D6A93]" />
                <span>Exportar PDF</span>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}