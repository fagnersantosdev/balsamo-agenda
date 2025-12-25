"use client";

import { usePathname } from "next/navigation";

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
        md:hidden
        px-2
        py-2
      "
    >
      <div className="flex justify-between items-center gap-2">

        <div className="flex flex-1 justify-around">
          {/* Agendamentos */}
          <button
            onClick={() => (window.location.href = "/admin")}
            className={`flex flex-col items-center ${
              isActive("/admin")
                ? "text-[#1F3924] font-semibold"
                : "text-[#1F3924]/60"
            }`}
          >
            📅
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
            🛠
            <span className="text-[11px] mt-1">Serviços</span>
          </button>

          {/* Avaliações */}
          <button
            onClick={() => (window.location.href = "/admin/testimonials")}
            className={`flex flex-col items-center ${
              isActive("/admin/testimonials")
                ? "text-[#1F3924] font-semibold"
                : "text-[#1F3924]/60"
            }`}
          >
            💬
            <span className="text-[11px] mt-1">Avaliações</span>
          </button>
        </div>

        {/* Exportar */}
        <button
          onClick={triggerPDF}
          className="
            flex flex-col items-center
            px-3
            text-[#8D6A93]
            hover:text-[#1F3924]
            transition
          "
        >
          📄
          <span className="text-[11px] mt-1">Exportar</span>
        </button>
      </div>
    </nav>
  );
}
