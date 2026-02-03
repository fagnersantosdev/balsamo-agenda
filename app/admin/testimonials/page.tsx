"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
//import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Toast from "@/app/components/Toast";


type AdminTestimonial = {
  id: number;
  author: string | null;
  message: string;
  rating: number | null;
  createdAt: string;
  approved: boolean;
};

type TabKey = "pending" | "approved" | "all";

const titleMap: Record<TabKey, string> = {
  pending: "Avaliações pendentes",
  approved: "Avaliações aprovadas",
  all: "Todas as avaliações",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function AdminTestimonialsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadData(tab: TabKey) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tab === "pending" || tab === "approved") {
        params.set("status", tab);
      }

      const res = await fetch(
        `/api/testimonials/admin?${params.toString()}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Erro ao buscar depoimentos");
      }

      const data: AdminTestimonial[] = await res.json();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

    // Adicione este estado para controlar o feedback de sucesso/erro
const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

// 🟢 APROVAR com feedback visual
async function handleApprove(id: number) {
  try {
    const res = await fetch(`/api/testimonials/admin/${id}/approve`, { method: "PUT" });
    if (!res.ok) throw new Error();
    
    setToast({ message: "✅ Avaliação aprovada com sucesso!", type: "success" });
    loadData(activeTab);
  } catch {
    setToast({ message: "❌ Erro ao aprovar avaliação.", type: "error" });
  }
}

// 🔴 EXCLUIR com Modal e Toast
async function handleDelete(id: number) {
  const confirmed = await showConfirmDialog({
    title: "Excluir Avaliação",
    message: "Tem certeza que deseja apagar este depoimento? Esta ação é permanente.",
    confirmText: "Excluir",
    confirmColor: "bg-red-600 hover:bg-red-700",
  });

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/testimonials/admin/${id}/delete`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    
    setToast({ message: "🗑️ Avaliação removida.", type: "success" });
    loadData(activeTab);
  } catch {
    setToast({ message: "❌ Erro ao excluir depoimento.", type: "error" });
  }
}  

// Caso não tenha a showConfirmDialog neste arquivo, cole ela aqui:
async function showConfirmDialog({
  title, message, confirmText, confirmColor
}: {
  title: string; message: string; confirmText: string; confirmColor: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 flex items-center justify-center bg-black/50 z-[100] backdrop-blur-sm";
    overlay.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-6 text-center w-[320px] animate-in fade-in zoom-in duration-200">
        <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-1.816c0-1.107-.833-2.015-1.912-2.015h-3.176c-1.08 0-1.912.898-1.912 2.015V6.75m7.5 0a48.112 48.112 0 0 0-7.5 0" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">${title}</h2>
        <p class="text-sm text-gray-500 mb-6">${message}</p>
        <div class="flex gap-3">
          <button id="cancelBtn" class="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">Cancelar</button>
          <button id="confirmBtn" class="flex-1 px-4 py-2.5 rounded-xl text-white font-medium ${confirmColor} transition-colors">${confirmText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById("confirmBtn")?.focus();

    document.getElementById("confirmBtn")?.addEventListener("click", () => { resolve(true); overlay.remove(); });
    document.getElementById("cancelBtn")?.addEventListener("click", () => { resolve(false); overlay.remove(); });
  });
}

  function renderList(list: AdminTestimonial[]) {
    if (loading) {
      return (
        <p className="text-sm text-[#1F3924]/70">
          Carregando avaliações...
        </p>
      );
    }

    if (list.length === 0) {
      return (
        <p className="text-sm text-[#1F3924]/70">
          Nenhuma avaliação encontrada.
        </p>
      );
    }

    return (
      <ul className="space-y-3">
        {list.map((t) => (
          <li
            key={t.id}
            className="bg-white/80 rounded-xl border border-[#8D6A93]/20 px-4 py-3 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1F3924]">
                    {t.author || "Anônimo"}
                  </span>
                  <span 
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${
                    t.approved 
                      ? "border-emerald-500 text-emerald-700 bg-emerald-50" 
                      : "border-amber-500 text-amber-700 bg-amber-50"
                  }`}
                >
                  {t.approved ? "Aprovada" : "Pendente"}
                </span>
                </div>
                <p className="text-xs text-[#1F3924]/60">
                  {formatDate(t.createdAt)}
                  {t.rating != null && ` • ⭐ ${t.rating}/5`}
                </p>
              </div>
            </div>

            <Separator className="my-1 bg-[#8D6A93]/10" />

            <p className="text-sm text-[#1F3924]/90 whitespace-pre-line">
              {t.message}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {!t.approved && (
                <Button
                  size="sm"
                  className="bg-[#1F3924] hover:bg-[#16301b] text-[#FFFEF9]"
                  onClick={() => handleApprove(t.id)}
                >
                  Aprovar
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(t.id)}
              >
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  // 🔹 Filtragem leve por aba (sem fazer 3 requisições)
  const pendingItems = items.filter((t) => !t.approved);
  const approvedItems = items.filter((t) => t.approved);

  return (
    <>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3924]">
            Avaliações dos clientes
          </h1>
          <p className="text-sm text-[#1F3924]/70">
            Aprove, gerencie e organize os depoimentos exibidos no site.
          </p>
        </div>
      </header>

      <Card className="border-[#8D6A93]/20 bg-[#F5F3EB]/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#1F3924] text-base mb-3">
            {titleMap[activeTab]}
          </CardTitle>

          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as TabKey)}
            className="mt-1"
          >
            <TabsList className="bg-white/80">
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="approved">Aprovadas</TabsTrigger>
              <TabsTrigger value="all">Todas</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              {renderList(pendingItems)}
            </TabsContent>

            <TabsContent value="approved" className="mt-4">
              {renderList(approvedItems)}
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              {renderList(items)}
            </TabsContent>
          </Tabs>
        </CardHeader>

        <CardContent />
      </Card>
      {toast && (
  <Toast 
    message={toast.message} 
    type={toast.type} 
    onClose={() => setToast(null)} 
  />
)}
    </>
  );
}