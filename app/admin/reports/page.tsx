"use client";

import { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, TrendingDown, CalendarDays, X, ChevronRight, Loader2, Printer} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BookingTable from "../../components/BookingTable"; 

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [metrics, setMetrics] = useState({ revenue: 0, lost: 0, totalBookings: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          status: statusFilter,
          month: monthFilter,
          year: yearFilter,
        });

        const res = await fetch(`/api/reports?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error("Erro ao procurar relatórios:", error);
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchReports();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, monthFilter, yearFilter]);

  // 🔹 NOVO EFEITO COM AVISO: Escuta o botão de PDF do Menu Mobile
  useEffect(() => {
    const handleExportPDF = () => {
      if (bookings.length > 0) {
        window.print();
      } else {
        // Usa o seu sistema global de Toast que criamos no AdminLayoutClient!
        if (window.__adminToast) {
          window.__adminToast({ 
            message: "Nenhum dado para exportar. Altere os filtros.", 
            type: "error" 
          });
        }
      }
    };

    window.addEventListener("admin:exportPDF", handleExportPDF);
    return () => window.removeEventListener("admin:exportPDF", handleExportPDF);
  }, [bookings.length]);

  // Filtros em formato de gaveta apenas para o Mobile
  const MobileFilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-black text-[#1F3924]/60 uppercase tracking-widest mb-2">Status</label>
        <div className="flex flex-col gap-2">
          {["TODOS", "CONCLUIDO", "PENDENTE", "CANCELADO"].map((s) => (
            <label key={s} className="flex items-center gap-3 p-3 rounded-xl border border-[#8D6A93]/10 bg-white cursor-pointer hover:border-[#8D6A93]/30 transition-all">
              <input 
                type="radio" 
                name="status" 
                value={s}
                checked={statusFilter === s}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-4 h-4 text-[#8D6A93] focus:ring-[#8D6A93]" 
              />
              <span className="text-sm font-bold text-[#1F3924]">
                {s === "CONCLUIDO" ? "Concluídos" : s === "PENDENTE" ? "Pendentes" : s === "CANCELADO" ? "Cancelados" : "Todos"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-[#1F3924]/60 uppercase tracking-widest mb-2">Mês</label>
        <select 
          value={monthFilter} 
          onChange={(e) => setMonthFilter(e.target.value)}
          className="w-full p-3 rounded-xl border border-[#8D6A93]/20 bg-white text-[#1F3924] font-medium focus:ring-2 focus:ring-[#8D6A93]/50 outline-none"
        >
          <option value="">Todos os meses</option>
          <option value="1">Janeiro</option>
          <option value="2">Fevereiro</option>
          <option value="3">Março</option>
          <option value="4">Abril</option>
          <option value="5">Maio</option>
          <option value="6">Junho</option>
          <option value="7">Julho</option>
          <option value="8">Agosto</option>
          <option value="9">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-black text-[#1F3924]/60 uppercase tracking-widest mb-2">Ano</label>
        <select 
          value={yearFilter} 
          onChange={(e) => setYearFilter(e.target.value)}
          className="w-full p-3 rounded-xl border border-[#8D6A93]/20 bg-white text-[#1F3924] font-medium focus:ring-2 focus:ring-[#8D6A93]/50 outline-none"
        >
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>
      </div>

      <button 
        onClick={() => setIsMobileFilterOpen(false)}
        className="w-full py-4 bg-[#1F3924] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#2a4d31] transition-colors"
      >
        Aplicar Filtros
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-8 px-2">
      {/* HEADER E BREADCRUMB */}
      <div className="mb-6 print:hidden">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-[#1F3924]/60 hover:text-[#8D6A93] transition-colors mb-4 group">
          Voltar para o Painel <ChevronRight className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-bold text-[#1F3924]">Gestão e Relatórios</h1>
        <p className="text-[#1F3924]/60 text-sm mt-1">Acompanhe o seu faturamento e procure agendamentos.</p>
      </div>

      {/* CARDS FINANCEIROS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-3xl border border-[#8D6A93]/10 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center opacity-50">
            <TrendingUp size={40} className="text-emerald-200" />
          </div>
          <p className="text-xs font-black text-[#1F3924]/50 uppercase tracking-widest mb-1 relative z-10">Receita Total</p>
          <h3 className="text-3xl font-bold text-emerald-600 relative z-10">
            {metrics.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#8D6A93]/10 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full flex items-center justify-center opacity-50">
            <TrendingDown size={40} className="text-red-200" />
          </div>
          <p className="text-xs font-black text-[#1F3924]/50 uppercase tracking-widest mb-1 relative z-10">Valor Cancelado</p>
          <h3 className="text-3xl font-bold text-red-500 relative z-10">
            {metrics.lost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#8D6A93]/10 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#8D6A93]/5 rounded-full flex items-center justify-center opacity-50">
            <CalendarDays size={40} className="text-[#8D6A93]/20" />
          </div>
          <p className="text-xs font-black text-[#1F3924]/50 uppercase tracking-widest mb-1 relative z-10">Atendimentos</p>
          <h3 className="text-3xl font-bold text-[#1F3924] relative z-10">{metrics.totalBookings}</h3>
        </div>
      </div>

      {/* BARRA DE PESQUISA E FILTROS HORIZONTAIS */}
      <div className="bg-white p-4 rounded-3xl border border-[#8D6A93]/10 shadow-sm mb-6 flex flex-col gap-4 print:hidden">
        
        {/* LINHA 1: BUSCA (Agora ocupa 100% da largura sempre) */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6A93]/50 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Procurar por nome do cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#F5F3EB]/50 border border-[#8D6A93]/20 rounded-2xl focus:ring-2 focus:ring-[#8D6A93]/50 outline-none transition-all text-[#1F3924] font-medium"
          />
        </div>

        {/* LINHA 2: CONTROLES DE FILTRO E PDF */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-[#8D6A93]/5">
          
          {/* Título / Ícone à esquerda */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#8D6A93]" />
            <span className="text-xs font-black text-[#1F3924]/60 uppercase tracking-widest">Filtros Avançados:</span>
          </div>

          {/* Botão de Filtro Mobile */}
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden w-full py-3 bg-[#1F3924] text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <Filter size={16} /> Selecionar Filtros
          </button>

          {/* Dropdowns de Filtro Desktop (Alinhados à direita) */}
          <div className="hidden lg:flex flex-wrap items-center gap-3">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#F5F3EB]/50 border border-[#8D6A93]/20 rounded-xl text-[#1F3924] font-bold text-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#8D6A93]/50"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="CONCLUIDO">Concluídos</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="CANCELADO">Cancelados</option>
            </select>

            <select 
              value={monthFilter} 
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#F5F3EB]/50 border border-[#8D6A93]/20 rounded-xl text-[#1F3924] font-bold text-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#8D6A93]/50"
            >
              <option value="">Todos os Meses</option>
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>

            <select 
              value={yearFilter} 
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#F5F3EB]/50 border border-[#8D6A93]/20 rounded-xl text-[#1F3924] font-bold text-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#8D6A93]/50"
            >
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>

            {bookings.length > 0 && (
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-[#8D6A93] text-white rounded-xl font-bold text-sm hover:bg-[#6a4e6f] transition-all flex items-center gap-2 shadow-sm ml-2"
                title="Salvar como PDF ou Imprimir"
              >
                <Printer size={18} /> PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ÁREA PRINCIPAL DA TABELA (Agora ocupando 100% da largura com scroll interno) */}
      <main className="w-full">
        <div className="bg-white rounded-[2.5rem] border border-[#8D6A93]/10 shadow-sm overflow-hidden">
           
           {/* 👇 O truque do scroll duplo fica nesta div abaixo 👇 */}
           <div className="max-h-[600px] overflow-auto hide-scrollbar print:max-h-none print:overflow-visible">
             {loading ? (
               <div className="flex flex-col items-center justify-center h-64 opacity-50">
                 <Loader2 className="animate-spin w-8 h-8 text-[#8D6A93] mb-4" />
                 <p className="text-[#1F3924] font-medium">Procurando dados...</p>
               </div>
             ) : bookings.length > 0 ? (
               <div className="w-full lg:min-w-[800px] p-2"> 
                 <BookingTable bookings={bookings} showActions={true} />
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                 <div className="w-16 h-16 bg-[#F5F3EB] rounded-2xl flex items-center justify-center mb-4 text-[#8D6A93]/40">
                   <Search size={32} />
                 </div>
                 <h3 className="text-lg font-bold text-[#1F3924]">Nenhum agendamento encontrado</h3>
                 <p className="text-[#1F3924]/50 text-sm mt-2 max-w-sm">
                   Tente ajustar os filtros ou verificar se o nome foi digitado corretamente.
                 </p>
               </div>
             )}
           </div>
           
        </div>
      </main>

      {/* MODAL DE FILTROS MOBILE */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-[#1F3924]/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-[#FAF8ED] w-full rounded-t-[2.5rem] p-6 pb-12 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-[#8D6A93]/20 rounded-full mx-auto mb-6" />
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-[#1F3924] flex items-center gap-2">
                  <Filter size={20} className="text-[#8D6A93]" /> Filtros
                </h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-white rounded-full text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <MobileFilterContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}