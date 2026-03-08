"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "../../../../components/Toast";
import { ChevronLeft, Edit3, DollarSign, Clock, ListPlus, Loader2, Sparkles } from "lucide-react";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
  details?: string[];
};

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setService(data);
      } catch {
        setToast({ message: "❌ Erro ao carregar dados.", type: "error" });
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchService();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const name = form.get("name") as string;
    const price = parseFloat(form.get("price") as string);
    const durationMin = parseInt(form.get("durationMin") as string);
    const detailsText = (form.get("details") as string) || "";

    const detailsArray = detailsText.split("\n").map((d) => d.trim()).filter(Boolean);

    if (!name || isNaN(price) || isNaN(durationMin)) {
      setToast({ message: "⚠️ Verifique os campos.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, durationMin, details: detailsArray }),
      });

      if (res.ok) {
        setToast({ message: "✅ Atualizado com sucesso!", type: "success" });
        setTimeout(() => router.push("/admin/services"), 1500);
      } else {
        setToast({ message: "❌ Erro ao salvar alterações.", type: "error" });
      }
    } catch {
      setToast({ message: "❌ Erro de conexão.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "block text-xs font-bold uppercase tracking-widest text-[#1F3924]/80 mb-2 ml-1";
  const inputClass = "w-full pl-10 pr-4 py-3 bg-white border border-[#8D6A93]/30 rounded-2xl focus:ring-2 focus:ring-[#8D6A93] focus:border-transparent outline-none transition-all text-[#1F3924]";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center opacity-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#8D6A93] mb-4" />
        <p className="font-medium text-[#1F3924]">Carregando serviço...</p>
      </div>
    );
  }

  if (!service) return <p className="text-center py-20 font-bold">Serviço não encontrado.</p>;

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-8 pb-32">
      <Link 
        href="/admin/services" 
        className="inline-flex items-center gap-2 text-sm font-medium text-[#1F3924]/60 hover:text-[#8D6A93] transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Voltar para lista
      </Link>

      <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl shadow-[#8D6A93]/5 border border-[#8D6A93]/10 relative">
        <header className="text-center mb-10">
          <div className="w-14 h-14 bg-[#F5F3EB] text-[#8D6A93] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Edit3 size={28} />
          </div>
          <h1 className="text-3xl font-bold text-[#1F3924]">Editar Serviço</h1>
          <p className="text-[#1F3924]/60 text-sm mt-2">Atualize as informações do tratamento selecionado.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className={labelClass}>Nome do Serviço</label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6A93]/80 w-5 h-5" />
              <input name="name" defaultValue={service.name} required className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Preço */}
            <div>
              <label className={labelClass}>Preço (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6A93]/80 w-5 h-5" />
                <input name="price" type="number" step="0.01" defaultValue={service.price} required className={inputClass} />
              </div>
            </div>

            {/* Duração */}
            <div>
              <label className={labelClass}>Duração (minutos)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6A93]/80 w-5 h-5" />
                <input name="durationMin" type="number" defaultValue={service.durationMin} required className={inputClass} />
              </div>
            </div>
          </div>

          {/* Detalhes */}
          <div>
            <label className={labelClass}>Detalhes (um por linha)</label>
            <div className="relative">
              <ListPlus className="absolute left-3 top-4 text-[#8D6A93]/80 w-5 h-5" />
              <textarea
                name="details"
                defaultValue={(service.details || []).join("\n")}
                className={`${inputClass} h-40 resize-none pl-10 pt-4`}
              />
            </div>
          </div>

          <button
            disabled={saving}
            className="w-full bg-[#1F3924] text-[#FFFEF9] py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#1F3924]/20 hover:bg-[#2a4d31] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin w-6 h-6" /> : "Salvar Alterações"}
          </button>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}