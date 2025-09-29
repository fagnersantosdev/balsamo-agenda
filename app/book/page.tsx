"use client";
import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import Toast from "../components/toast";


type Service = { id: number; name: string; durationMin: number };

// Ícone de borboleta simples (SVG próprio)
function Butterfly(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* corpo/antenas */}
      <path d="M32 14v18" />
      <path d="M30 10c1 2 5 2 6 0" />
      <circle cx="33" cy="9" r="1.5" fill="currentColor" />
      <circle cx="31" cy="9" r="1.5" fill="currentColor" />
      {/* asas esquerda/direita (curvas suaves) */}
      <path d="M32 32c-7-10-19-14-25-9s-4 15 7 15c9 0 14-4 18-6" />
      <path d="M32 32c7-10 19-14 25-9s4 15-7 15c-9 0-14-4-18-6" />
    </svg>
  );
}

export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);


  useEffect(() => {
    fetch("/api/services").then((res) => res.json()).then(setServices);
  }, []);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setMsg(null);
  setLoading(true);

  const form = new FormData(e.currentTarget);

  const rawPhone = (form.get("clientPhone") as string) || "";
  const cleanedPhone = rawPhone.replace(/\D/g, "");

  const payload = {
    clientName: form.get("clientName"),
    clientPhone: cleanedPhone,
    clientEmail: form.get("clientEmail") || null,
    serviceId: Number(form.get("serviceId")),
    startDateTime: form.get("startDateTime"),
  };

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsgType("error");
      setMsg(`❌ Não foi possível agendar: ${data.error || "Verifique os dados e tente novamente."}`);
    } else {
      setMsgType("success");
      setMsg(
        `✨ Agendamento para ${new Date(data.startDateTime).toLocaleString("pt-BR")} realizado com sucesso! 💆‍♀️`
      );
      e.currentTarget.reset();
    }
  } catch (error) {
    setMsgType("error");
    setMsg("❌ Erro de conexão. Tente novamente mais tarde.");
  } finally {
    setLoading(false); // ✅ garante que sempre habilita o botão de novo
  }
}


  return (
    <main className="relative max-w-lg mx-auto bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8 border border-purple-100">
      {/* Borboletas decorativas */}
      <Butterfly className="absolute -top-4 -left-4 w-10 h-10 text-purple-300 rotate-12" />
      <Butterfly className="absolute -bottom-6 -right-6 w-12 h-12 text-green-900/20 -rotate-12" />

      <h1 className="flex items-center gap-2 text-2xl font-bold text-green-900">
      <Image src="/borboleta.png" alt="Borboleta" width={50} height={50} />
       Agendar Atendimento
      </h1>


      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-green-900">Nome</label>
          <input
            name="clientName"
            required
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-green-900">
            Telefone (WhatsApp):
          </label>
          <input
            type="tel"
            name="clientPhone"
            required
            placeholder="Ex.: (24) 99999-9999"
            className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <p className="text-xs text-green-700 mt-1">
            Informe o número com DDD. Formatos como (24) 99999-9999 também são aceitos.
          </p>

        </div>

        <div>
          <label className="block text-sm text-green-900">
            E-mail (opcional)
          </label>
          <input
            name="clientEmail"
            type="email"
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm text-green-900">Serviço</label>
          <select
            name="serviceId"
            required
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-green-900">Data e Hora</label>
          <input
            name="startDateTime"
            type="datetime-local"
            required
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-green-900 text-purple-50 font-medium px-4 py-2 rounded-lg hover:bg-green-800 transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? "Agendando..." : "Confirmar Agendamento"}
        </button>

      </form>
                      {msg && (
                <Toast
                  message={msg}
                  type={msgType || "success"}
                  onClose={() => setMsg(null)}
                />
              )}
    </main>
    
  );
}
