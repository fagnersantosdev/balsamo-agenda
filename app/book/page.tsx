"use client";
import { useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  durationMin: number;
};

export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Carrega os serviços cadastrados
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      clientName: formData.get("clientName"),
      clientPhone: formData.get("clientPhone"),
      clientEmail: formData.get("clientEmail") || null,
      serviceId: Number(formData.get("serviceId")),
      startDateTime: formData.get("startDateTime"),
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Erro ao agendar. Escolha outro horário.");
    } else {
      setMsg(`Agendamento criado com sucesso para ${new Date(data.startDateTime).toLocaleString("pt-BR")}`);
      e.currentTarget.reset();
    }
    setLoading(false);
  }

  return (
    <main className="bg-white rounded-2xl shadow p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">Agendar Atendimento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nome</label>
          <input name="clientName" required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm">Telefone/WhatsApp</label>
          <input name="clientPhone" required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm">E-mail (opcional)</label>
          <input name="clientEmail" type="email" className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm">Serviço</label>
          <select name="serviceId" required className="border rounded px-3 py-2 w-full">
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Data e Hora</label>
          <input name="startDateTime" type="datetime-local" required className="border rounded px-3 py-2 w-full" />
        </div>
        <button
          disabled={loading}
          className="bg-emerald-600 text-white rounded px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Agendando..." : "Confirmar Agendamento"}
        </button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </main>
  );
}
