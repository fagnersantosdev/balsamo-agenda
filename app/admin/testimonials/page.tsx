"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  async function handleApprove(id: number) {
    try {
      const res = await fetch(`/api/testimonials/admin/${id}/approve`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error();
      loadData(activeTab);
    } catch {
      alert("Não foi possível aprovar este depoimento.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    try {
      const res = await fetch(`/api/testimonials/admin/${id}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      loadData(activeTab);
    } catch {
      alert("Não foi possível excluir este depoimento.");
    }
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
                  <Badge
                    variant="outline"
                    className={
                      t.approved
                        ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                        : "border-amber-500 text-amber-700 bg-amber-50"
                    }
                  >
                    {t.approved ? "Aprovada" : "Pendente"}
                  </Badge>
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
    </>
  );
}