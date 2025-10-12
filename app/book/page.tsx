"use client";
import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import Image from "next/image";
import Toast from "../components/toast";
import EventPromo from "../components/EventPromo";
import SuccessCard from "../components/SuccessCard";

type Service = { id: number; name: string; durationMin: number };

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
      <path d="M32 14v18" />
      <path d="M30 10c1 2 5 2 6 0" />
      <circle cx="33" cy="9" r="1.5" fill="currentColor" />
      <circle cx="31" cy="9" r="1.5" fill="currentColor" />
      <path d="M32 32c-7-10-19-14-25-9s-4 15 7 15c9 0 14-4 18-6" />
      <path d="M32 32c7-10 19-14 25-9s4 15-7 15c-9 0-14-4-18-6" />
    </svg>
  );
}

type Booking = {
  id: number;
  clientName: string;
  clientPhone: string;
  startDateTime: string;
  endDateTime: string;
  serviceId: number;
};


export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [successData, setSuccessData] = useState<{
    name: string;
    date: string;
    service: string;
    phone?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/services").then((res) => res.json()).then(setServices);
  }, []);

async function loadAvailableTimes(date: string, serviceId: number) {
  if (!date || !serviceId) return;

  // 📦 Busca os agendamentos existentes
  const res = await fetch(`/api/bookings`);
  const data = (await res.json()) as Booking[];

  // 📦 Busca o serviço selecionado para saber sua duração
  const service = services.find((s) => s.id === serviceId);
  if (!service) return;

  const selectedDay = new Date(date);
  const sameDayBookings = data.filter((b) => {
    const d = new Date(b.startDateTime);
    return d.toDateString() === selectedDay.toDateString();
  });

  const times: string[] = [];

  // ⏰ Define faixa de horário de funcionamento
  const openingHour = 9;
  const closingHour = 20;

  // 🧮 Duração do serviço em minutos
  const duration = service.durationMin;

  // 🧩 Gera os horários de início possíveis com base na duração
  for (let h = openingHour; h < closingHour; h++) {
    for (let m = 0; m < 60; m += 15) { // passo menor para encaixar melhor
      const start = new Date(date);
      start.setHours(h, m, 0, 0);
      const end = new Date(start.getTime() + duration * 60000);

      // se o serviço terminar depois do expediente → ignora
      if (end.getHours() >= closingHour && end.getMinutes() > 0) continue;

      // 🔎 Verifica se conflita com algum agendamento existente
      const hasConflict = sameDayBookings.some((b) => {
        const bStart = new Date(b.startDateTime);
        const bEnd = new Date(b.endDateTime);
        return start < bEnd && end > bStart;
      });

      if (!hasConflict) {
        times.push(start.toISOString());
      }
    }
  }

  // ✅ Atualiza os horários disponíveis
  setAvailableTimes(times);
}

  // 🔹 Submissão do agendamento
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    setSuccessData(null);

    const form = new FormData(e.currentTarget);
    const rawPhone = (form.get("clientPhone") as string) || "";
    const cleanedPhone = rawPhone.replace(/\D/g, "");

    const payload = {
      clientName: form.get("clientName"),
      clientPhone: cleanedPhone,
      clientEmail: form.get("clientEmail") || null,
      serviceId: Number(form.get("serviceId")),
      startDateTime: form.get("startDateTime"), // vem do <select>
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
        setMsg(`❌ ${data.error || "Não foi possível agendar. Verifique os dados e tente novamente."}`);
        setTimeout(() => setMsg(null), 4000);
        return;
      }

      const booking = data.booking;
      const formattedDate = new Date(booking.startDateTime).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });

      setMsgType("success");
      setMsg("✨ Agendamento realizado com sucesso! 💆‍♀️");

      setSuccessData({
        name: booking.clientName,
        date: formattedDate,
        service: booking.service.name,
        phone: booking.clientPhone,
      });

      // 🧹 Limpa formulário e atualiza horários
      (e.target as HTMLFormElement).reset();
      setAvailableTimes([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setMsg(null), 4000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="relative max-w-lg mx-auto bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8 border border-purple-100">
        <Butterfly className="absolute -top-4 -left-4 w-10 h-10 text-purple-500 rotate-12" />
        <Butterfly className="absolute -bottom-6 -right-6 w-12 h-12 text-[#1F3924] -rotate-12" />

        <h1 className="flex items-center gap-2 text-2xl font-bold text-[#1F3924] mb-4">
          <Image src="/borboleta.png" alt="Borboleta" width={45} height={45} />
          Agendar Atendimento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-[#1F3924]">Nome</label>
            <input
              name="clientName"
              required
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#8D6A93]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-[#1F3924]">Telefone (WhatsApp)</label>
            <input
              type="tel"
              name="clientPhone"
              required
              placeholder="Ex.: (24) 99999-9999"
              className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#8D6A93]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-[#1F3924]">E-mail (opcional)</label>
            <input
              name="clientEmail"
              type="email"
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#8D6A93]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-[#1F3924]">Serviço</label>
            <select
              name="serviceId"
              required
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#8D6A93]"
              onChange={(e) => {
                const serviceId = Number(e.target.value);
                const date = (document.querySelector("[name='date']") as HTMLInputElement)?.value;
                if (date && serviceId) loadAvailableTimes(date, serviceId);
              }}
            >
              <option value="">Selecione um serviço</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-[#1F3924]">Data</label>
            <input
              type="date"
              name="date"
              required
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#8D6A93]"
              onChange={(e) => {
                const date = e.target.value;
                const serviceId = Number((document.querySelector("[name='serviceId']") as HTMLSelectElement)?.value);
                if (serviceId && date) loadAvailableTimes(date, serviceId);
              }}
            />
          </div>

          {/* 🕒 Select de horários disponíveis */}
          <div>
            <label className="block mb-2 font-medium text-[#1F3924]">Horário</label>
            <select
              name="startDateTime"
              required
              disabled={availableTimes.length === 0}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#8D6A93] disabled:bg-gray-100"
            >
              <option value="">
                {availableTimes.length === 0 ? "Selecione a data e o serviço" : "Selecione um horário disponível"}
              </option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#1F3924] text-purple-50 font-medium px-4 py-2 rounded-lg hover:bg-green-900 transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Agendando..." : "Confirmar Agendamento"}
          </button>
        </form>

        {/* 🟩 Mensagens e feedback */}
        {successData && (
          <SuccessCard
            show={true}
            onClose={() => setSuccessData(null)}
            name={successData.name}
            date={successData.date}
            service={successData.service}
            phone={successData.phone}
          />
        )}

        {msg && !successData && (
          <Toast message={msg} type={msgType || "error"} onClose={() => setMsg(null)} />
        )}
      </main>

      <EventPromo />
    </>
  );
}
