"use client";

import { useEffect, useState } from "react";
//import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
//import { Separator } from "@/components/ui/separator";
import Toast from "@/app/components/Toast";
import { CheckCircle2, Trash2, MessageSquare, Star, Clock, AlertCircle, Loader2, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type AdminTestimonial = {
  id: number;
  author: string | null;
  message: string;
  rating: number | null;
  createdAt: string;
  approved: boolean;
};

type TabKey = "pending" | "approved" | "all";

export default function AdminTestimonialsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Estado para o Modal de Confirmação
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    id?: number;
  }>({ show: false });

  async function loadData(tab: TabKey) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tab === "pending" || tab === "approved") params.set("status", tab);
      const res = await fetch(`/api/testimonials/admin?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setItems(data);
    } catch {
      setToast({ message: "Erro ao carregar dados", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(activeTab); }, [activeTab]);

  async function handleApprove(id: number) {
    try {
      const res = await fetch(`/api/testimonials/admin/${id}/approve`, { method: "PUT" });
      if (!res.ok) throw new Error();
      setToast({ message: "Avaliação publicada com sucesso!", type: "success" });
      loadData(activeTab);
    } catch {
      setToast({ message: "Erro ao aprovar.", type: "error" });
    }
  }

  async function handleDelete() {
    if (!confirmModal.id) return;
    try {
      const res = await fetch(`/api/testimonials/admin/${confirmModal.id}/delete`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setToast({ message: "Avaliação removida.", type: "success" });
      setConfirmModal({ show: false });
      loadData(activeTab);
    } catch {
      setToast({ message: "Erro ao excluir.", type: "error" });
    }
  }

  function renderList(list: AdminTestimonial[]) {
    if (loading) return (
      <div className="flex flex-col items-center py-12 opacity-40">
        <Loader2 className="animate-spin w-8 h-8 text-[#8D6A93]" />
      </div>
    );

    if (list.length === 0) return (
      <div className="text-center py-12 border-2 border-dashed border-[#8D6A93]/10 rounded-2xl">
        <MessageSquare className="mx-auto w-10 h-10 text-[#8D6A93]/20 mb-3" />
        <p className="text-sm font-medium text-[#1F3924]/60">Nenhum depoimento encontrado.</p>
      </div>
    );

    return (
      <div className="grid grid-cols-1 gap-4">
        {list.map((t) => (
          <motion.div
            layout
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#8D6A93]/15 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#8D6A93]/10 flex items-center justify-center text-[#8D6A93] font-bold">
                  {(t.author || "A")[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-[#1F3924]">{t.author || "Anônimo"}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#1F3924]/50 uppercase font-black tracking-widest">
                    <Clock size={12} />
                    {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                    {t.rating != null && (
                      <span className="flex items-center gap-0.5 ml-2 text-amber-500">
                        <Star size={10} fill="currentColor" /> {t.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                t.approved ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}>
                {t.approved ? "Aprovada" : "Pendente"}
              </span>
            </div>

            <p className="text-[#1F3924]/100 text-sm leading-relaxed mb-6 italic">
              &ldquo;{t.message}&rdquo;
            </p>

            <div className="flex gap-2">
              {!t.approved && (
                <Button
                  onClick={() => handleApprove(t.id)}
                  className="flex-1 bg-[#1F3924] hover:bg-[#2a4d31] text-white rounded-xl gap-2 font-bold transition-all active:scale-95"
                >
                  <CheckCircle2 size={18} /> Aprovar no Site
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setConfirmModal({ show: true, id: t.id })}
                className="px-4 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-8 pb-32">
      {/* Header */}
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-[#1F3924]/60 hover:text-[#8D6A93] transition-colors mb-8 group">
        <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        Voltar para o Painel
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[#1F3924] mb-2 flex items-center gap-3">
          <MessageSquare className="text-[#8D6A93]" /> Depoimentos
        </h1>
        <p className="text-[#1F3924]/80 text-sm">Controle as mensagens de carinho que aparecem no rodapé do seu site.</p>
      </header>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabKey)} className="space-y-6">
        <TabsList className="bg-[#F5F3EB] p-1 rounded-2xl border border-[#8D6A93]/10 inline-flex">
          <TabsTrigger value="pending" className="rounded-xl px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-[#8D6A93] data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest transition-all">
            Pendentes
          </TabsTrigger>
          <TabsTrigger value="approved" className="rounded-xl px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-[#8D6A93] data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest transition-all">
            Aprovadas
          </TabsTrigger>
          <TabsTrigger value="all" className="rounded-xl px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-[#8D6A93] data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest transition-all">
            Ver Todas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0 focus-visible:outline-none">
          {renderList(items.filter(i => !i.approved))}
        </TabsContent>
        <TabsContent value="approved" className="mt-0 focus-visible:outline-none">
          {renderList(items.filter(i => i.approved))}
        </TabsContent>
        <TabsContent value="all" className="mt-0 focus-visible:outline-none">
          {renderList(items)}
        </TabsContent>
      </Tabs>

      {/* 🛑 Modal de Confirmação Refinado */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#1F3924]/40 backdrop-blur-sm" onClick={() => setConfirmModal({ show: false })} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><AlertCircle size={32} /></div>
              <h2 className="text-2xl font-bold text-[#1F3924] mb-2">Excluir Depoimento?</h2>
              <p className="text-[#1F3924]/60 mb-8">Esta ação não pode ser desfeita e o depoimento sairá do site permanentemente.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal({ show: false })} className="flex-1 py-3 font-bold text-[#1F3924]/40 hover:text-[#1F3924]">Cancelar</button>
                <button onClick={handleDelete} className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-200">Excluir</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}