"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../../components/ToastMessage";
import { Plus, Trash2, Edit3, RotateCcw, Sparkles, Clock, DollarSign, AlertTriangle, Loader2 } from "lucide-react";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
  active: boolean;
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showActive, setShowActive] = useState(true);
  
  // Estado para o novo Modal de Confirmação
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
    color: string;
  }>({ show: false, title: "", message: "", action: () => {}, color: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices(active = true) {
    try {
      setLoading(true);
      const url = active ? "/api/services" : "/api/services/deleted";
      const res = await fetch(url);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
      setShowActive(active);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔥 Nova Função de Exclusão usando o Modal React
  function confirmDelete(id: number) {
    setConfirmModal({
      show: true,
      title: "Excluir Serviço?",
      message: "Este serviço não aparecerá mais para agendamento, mas poderá ser restaurado depois.",
      color: "bg-red-600 hover:bg-red-700",
      action: async () => {
        const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
        if (res.ok) {
          setToast({ message: "Serviço excluído!", type: "success" });
          fetchServices(true);
        }
        setConfirmModal(prev => ({ ...prev, show: false }));
      }
    });
  }

  async function handleRestore(id: number) {
    const res = await fetch(`/api/services/${id}/restore`, { method: "PATCH" });
    if (res.ok) {
      setToast({ message: "Serviço restaurado!", type: "success" });
      fetchServices(true);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#083536] flex items-center gap-2">
            <Sparkles className="text-[#97709B]" /> Serviços
          </h1>
          <p className="text-[#083536]/80 text-sm mt-1">Configure o menu de tratamentos do Bálsamo.</p>
        </div>

        <Link
          href="/admin/services/new"
          className="flex items-center justify-center gap-2 bg-[#083536] text-[#FAF8ED] px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#083536]/10 hover:bg-[#083536]/80 transition-all"
        >
          <Plus size={20} /> Novo Serviço
        </Link>
      </div>

      {/* 🔹 Filtros de Status */}
      <div className="flex p-1 bg-[#F5F3EB] rounded-xl w-fit mb-8 border border-[#97709B]/10">
        <button
          onClick={() => fetchServices(true)}
          className={`px-12 py-2 rounded-lg text-sm font-bold transition-all ${
            showActive ? "bg-[#FAF8ED] text-[#97709B] shadow-sm" : "text-[#083536]/50 hover:text-[#083536]"
          }`}
        >
          Ativos
        </button>
        <button
          onClick={() => fetchServices(false)}
          className={`px-12 py-2 rounded-lg text-sm font-bold transition-all ${
            !showActive ? "bg-[#FAF8ED] text-[#97709B] shadow-sm" : "text-[#083536]/50 hover:text-[#083536]"
          }`}
        >
          Excluídos
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 opacity-40">
           <Loader2 className="animate-spin w-10 h-10 text-[#97709B] mb-4" />
           <p className="font-medium">Buscando serviços...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={showActive ? "ativos" : "excluidos"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {services.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-[#FAF8ED] rounded-3xl border border-dashed border-[#97709B]/60">
                <p className="text-[#083536]/40 font-medium italic">Nenhum serviço encontrado nesta categoria.</p>
              </div>
            ) : (
              services.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  className={`bg-[#FAF8ED] rounded-3xl p-6 border transition-all hover:shadow-xl hover:shadow-[#97709B]/5 ${
                    s.active ? "border-[#97709B]/15" : "border-gray-200 grayscale-[0.5]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#083536]">{s.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      s.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {s.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-[#8B4E23]">
                      <DollarSign size={16} /> R$ {s.price.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-[#083536]/60">
                      <Clock size={16} /> {s.durationMin} min
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {s.active ? (
                      <>
                        <Link
                          href={`/admin/services/${s.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#FAF8ED] text-[#083536] py-3 rounded-xl font-bold text-sm hover:bg-[#EDE7F1] transition-colors"
                        >
                          <Edit3 size={16} /> Editar
                        </Link>
                        <button
                          onClick={() => confirmDelete(s.id)}
                          className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRestore(s.id)}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-[#FAF8ED] py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                      >
                        <RotateCcw size={18} /> Restaurar Serviço
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* 🛑 Modal de Confirmação (Puro React) */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#083536]/40 backdrop-blur-sm"
              onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#FAF8ED] rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[#083536] mb-2">{confirmModal.title}</h2>
              <p className="text-[#083536]/60 mb-8">{confirmModal.message}</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                  className="flex-1 py-3 font-bold text-[#083536]/40 hover:text-[#083536] transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmModal.action}
                  className={`flex-1 py-3 rounded-2xl text-[#FAF8ED] font-bold shadow-lg ${confirmModal.color}`}
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}