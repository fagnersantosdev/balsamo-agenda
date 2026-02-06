"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "../../../components/Toast";
import { ChevronLeft, Sparkles, DollarSign, Clock, ListPlus, Loader2 } from "lucide-react";

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const name = form.get("name") as string;
    const price = parseFloat(form.get("price") as string);
    const durationMin = parseInt(form.get("durationMin") as string);
    const detailsText = (form.get("details") as string) || "";

    const detailsArray = detailsText
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    if (!name || isNaN(price) || isNaN(durationMin)) {
      setToast({ message: "⚠️ Preencha todos os campos obrigatórios.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, durationMin, details: detailsArray }),
      });

      if (res.ok) {
        setToast({ message: "✅ Serviço criado com sucesso!", type: "success" });
        formEl.reset();
        setTimeout(() => router.push("/admin/services"), 2000);
      } else {
        const err = await res.json();
        setToast({
          message: `❌ Erro: ${err.error || "Verifique os dados."}`,
          type: "error",
        });
      }
    } catch {
      setToast({ message: "❌ Falha na conexão. Tente novamente.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const labelClass = "block text-xs font-bold uppercase tracking-widest text-[#1F3924]/60 mb-2 ml-1";
  const inputClass = "w-full pl-10 pr-4 py-3 bg-white border border-[#8D6A93]/20 rounded-2xl focus:ring-2 focus:ring-[#8D6A93] focus:border-transparent outline-none transition-all text-[#1F3924] placeholder:text-gray-300";

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-8 pb-32">
      {/* Voltar */}
      <Link 
        href="/admin/services" 
        className="inline-flex items-center gap-2 text-sm font-medium text-[#1F3924]/60 hover:text-[#8D6A93] transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Voltar para serviços
      </Link>

      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl shadow-[#8D6A93]/5 border border-[#8D6A93]/10">
        <header className="text-center mb-10">
          <div className="w-14 h-14 bg-[#8D6A93]/10 text-[#8D6A93] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl font-bold text-[#1F3924]">Novo Serviço</h1>
          <p className="text-[#1F3924]/60 text-sm mt-2">Cadastre um novo tratamento para seus clientes.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className={labelClass}>Nome do Serviço</label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6A93]/40 w-5 h-5" />
              <input name="name" required placeholder="Ex.: Massagem Terapêutica" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Preço */}
            <div>
              <label className={labelClass}>Preço Sugerido</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6A93]/40 w-5 h-5" />
                <input name="price" type="number" step="0.01" required placeholder="0,00" className={inputClass} />
              </div>
            </div>

            {/* Duração */}
            <div>
              <label className={labelClass}>Duração Estimada</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6A93]/40 w-5 h-5" />
                <input name="durationMin" type="number" required placeholder="Minutos" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Detalhes */}
          <div>
            <label className={labelClass}>Detalhes e Benefícios</label>
            <div className="relative">
              <ListPlus className="absolute left-3 top-4 text-[#8D6A93]/40 w-5 h-5" />
              <textarea
                name="details"
                placeholder={"Pressione 'Enter' para cada novo item:\nEx: Alívio de tensões\nEx: Óleos essenciais"}
                className={`${inputClass} h-40 resize-none pl-10 pt-4`}
              />
            </div>
            <p className="text-[10px] text-[#1F3924]/40 mt-2 ml-1 italic">
              * Cada linha se tornará um tópico na visualização do cliente.
            </p>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#1F3924] text-[#FFFEF9] py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#1F3924]/20 hover:bg-[#2a4d31] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              "Criar Serviço"
            )}
          </button>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}