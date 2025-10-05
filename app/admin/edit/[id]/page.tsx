"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Booking = {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  startDateTime: string;
  serviceId: number;
};

type Service = {
  id: number;
  name: string;
};

export default function EditBookingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 Buscar dados do agendamento e serviços
  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingRes, servicesRes] = await Promise.all([
          fetch(`/api/bookings/${id}`),
          fetch(`/api/services`),
        ]);

        const bookingData = await bookingRes.json();
        const servicesData = await servicesRes.json();

        setBooking(bookingData);
        setServices(servicesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  // 🔹 Atualizar o estado ao digitar
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!booking) return;
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  }

  // 🔹 Enviar alterações
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!booking) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      if (res.ok) {
        setMessage("✅ Agendamento atualizado com sucesso!");
        setTimeout(() => router.push("/admin"), 1500);
      } else {
        setMessage("❌ Erro ao atualizar o agendamento.");
      }
    } catch (error) {
      setMessage("❌ Falha ao se conectar com o servidor.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-center py-10 text-[#1F3924]">Carregando...</p>;
  }

  if (!booking) {
    return <p className="text-center py-10 text-red-600">Agendamento não encontrado.</p>;
  }

  return (
    <main className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6">Editar Agendamento</h1>

      {message && (
        <div
          className={`mb-4 text-center py-2 rounded-lg ${
            message.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome */}
        <div>
          <label className="block font-medium text-[#1F3924] mb-1">Nome do Cliente</label>
          <input
            type="text"
            name="clientName"
            value={booking.clientName}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700 outline-none"
            required
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block font-medium text-[#1F3924] mb-1">Telefone</label>
          <input
            type="text"
            name="clientPhone"
            value={booking.clientPhone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700 outline-none"
            required
          />
        </div>

        {/* E-mail */}
        <div>
          <label className="block font-medium text-[#1F3924] mb-1">E-mail</label>
          <input
            type="email"
            name="clientEmail"
            value={booking.clientEmail || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700 outline-none"
          />
        </div>

        {/* Serviço */}
        <div>
          <label className="block font-medium text-[#1F3924] mb-1">Serviço</label>
          <select
            name="serviceId"
            value={booking.serviceId}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700 outline-none"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Data e Hora */}
        <div>
          <label className="block font-medium text-[#1F3924] mb-1">Data e Hora</label>
          <input
            type="datetime-local"
            name="startDateTime"
            value={new Date(booking.startDateTime).toISOString().slice(0, 16)}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700 outline-none"
            required
          />
        </div>

        {/* Botões */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Voltar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition disabled:opacity-60"
          >
            {saving ? "Salvando..." : "💾 Salvar Alterações"}
          </button>
        </div>
      </form>
    </main>
  );
}
