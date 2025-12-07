"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Toast from "../components/Toast";
import EventPromo from "../components/EventPromo";
import SuccessCard from "../components/SuccessCard";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { ptBR } from "date-fns/locale";

/* ============================================================
   TIPOS
============================================================ */
type Service = { id: number; name: string; durationMin: number };

type Availability = {
  dayOfWeek: number; // 0=domingo ... 6=sábado (usando js getDay)
  openHour: number;
  closeHour: number;
  active: boolean;
};

type Booking = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  serviceId: number;
  status: "PENDENTE" | "CONCLUIDO" | "CANCELADO";
};

type SuccessInfo = {
  name: string;
  date: string;
  service: string;
  phone?: string;
};

/* ============================================================
   MAPEAMENTO PARA availability (aqui usamos o próprio getDay)
============================================================ */
function mapDay(jsDay: number): number {
  // Se no banco o dayOfWeek está 0–6 (domingo–sábado),
  // basta retornar o jsDay direto.
  return jsDay;
}

/* ============================================================
   FORMATAÇÃO SEGURA DE HORÁRIO LOCAL
============================================================ */
function formatSlot(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:00`;
}

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */
export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);
  const [successData, setSuccessData] = useState<SuccessInfo | null>(null);

  /* ============================================================
     CARREGA SERVIÇOS + DISPONIBILIDADE
  ============================================================ */
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices)
      .catch(() => {});

    fetch("/api/availability")
      .then((r) => r.json())
      .then(setAvailability)
      .catch(() => {});
  }, []);

  /* ============================================================
     GERAR HORÁRIOS DISPONÍVEIS
  ============================================================ */
  async function loadAvailableTimes(dateString: string, serviceId: number) {
    if (!serviceId || !dateString) return;

    setAvailableTimes([]);

    // Cria a data LOCAL sem UTC
    const [year, month, day] = dateString.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day, 0, 0, 0);

    // Buscar TODOS os agendamentos
    const res = await fetch("/api/bookings");
    const allBookings: Booking[] = res.ok ? await res.json() : [];

    // Apenas do dia selecionado e que NÃO foram cancelados
    const bookingsDoDia = allBookings.filter((b) => {
      if (b.status === "CANCELADO") return false;
      const start = new Date(b.startDateTime);
      return start.toDateString() === selectedDate.toDateString();
    });

    // Disponibilidade do dia
    const dbDay = mapDay(selectedDate.getDay());
    const dayAvail = availability.find((a) => a.dayOfWeek === dbDay);

    if (!dayAvail || !dayAvail.active) {
      setMsgType("error");
      setMsg("🚫 Este dia não está disponível para agendamento.");
      return;
    }

    const slots: string[] = [];

    for (let hour = dayAvail.openHour; hour < dayAvail.closeHour; hour++) {
      const slot = new Date(selectedDate);
      slot.setHours(hour, 0, 0, 0);

      // Se for o dia real de hoje, não mostrar horários já passados
      const todayReal = new Date();
      todayReal.setHours(0, 0, 0, 0);

      if (selectedDate.toDateString() === todayReal.toDateString()) {
        if (slot.getTime() <= Date.now()) continue;
      }

      const conflict = bookingsDoDia.some((b) => {
        const start = new Date(b.startDateTime);
        const end = new Date(b.endDateTime);
        return slot >= start && slot < end;
      });

      if (!conflict) slots.push(formatSlot(slot));
    }

    setAvailableTimes(slots);
  }

  /* ============================================================
     SUBMIT DO FORMULÁRIO
  ============================================================ */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget as HTMLFormElement;

    const form = new FormData(formEl);

    const payload = {
      clientName: form.get("clientName"),
      clientPhone: String(form.get("clientPhone")).replace(/\D/g, ""),
      clientEmail: form.get("clientEmail") || null,
      serviceId: Number(form.get("serviceId")),
      startDateTime: form.get("startDateTime"),
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsgType("error");
      setMsg(`❌ ${data.error}`);
      return;
    }

    const booking = data.booking;

    setSuccessData({
      name: booking.clientName,
      date: new Date(booking.startDateTime).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      service: booking.service.name,
      phone: booking.clientPhone,
    });

    // Limpa horários e formulário
    setAvailableTimes([]);
    if (formEl) formEl.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ============================================================
     INTERFACE
  ============================================================ */
  return (
    <>
      {/* Fundo da página já vem do RootLayout; aqui usamos um card central */}
      <main className="relative max-w-lg mx-auto bg-[#F5F3EB] p-6 sm:p-10 rounded-3xl shadow-xl border border-[#D6A77A]/40 mt-8 mb-16">

        {/* Título centralizado */}
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src="/borboleta.png"
            width={50}
            height={50}
            alt="Borboleta"
            className="opacity-90 mx-auto"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F3924] mt-3 leading-tight">
            Agendar <br /> Atendimento
          </h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="clientName"
            required
            placeholder="Nome completo"
            className="w-full p-3 border border-[#8D6A93]/30 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />

          <input
            name="clientPhone"
            required
            placeholder="(24) 99999-9999"
            className="w-full p-3 border border-[#8D6A93]/30 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />

          <input
            name="clientEmail"
            placeholder="E-mail (opcional)"
            className="w-full p-3 border border-[#8D6A93]/30 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />

          {/* Serviço */}
          <select
            name="serviceId"
            required
            className="w-full p-3 border border-[#8D6A93]/30 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
            onChange={(e) => {
              if (!selectedDate) return;
              loadAvailableTimes(
                selectedDate.toISOString().split("T")[0],
                Number(e.target.value)
              );
            }}
          >
            <option value="">Selecione um serviço...</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Calendário ajustado sem scroll horizontal */}
          <div
            className="
              bg-white/70 p-2 rounded-xl border border-[#8D6A93]/20 
              shadow-inner backdrop-blur
              max-w-full
              overflow-hidden
            "
          >
            <div className="mx-auto">
              <DayPicker
              mode="single"
              selected={selectedDate ?? undefined}
              locale={ptBR}
              weekStartsOn={1}
              className="text-[#1F3924] balsamo-calendar"
              disabled={(d) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return d < today || d.getDay() === 0 || d.getDay() === 6;
              }}
              onSelect={(date) => {
                if (!date) return;

                setSelectedDate(date);

                const serviceId = Number(
                  (document.querySelector("[name='serviceId']") as HTMLSelectElement)
                    ?.value
                );

                if (serviceId) {
                  loadAvailableTimes(date.toISOString().split("T")[0], serviceId);
                }
              }}
            />
            </div>
          </div>

          {/* Horários disponíveis */}
          {availableTimes.length > 0 ? (
            <select
              name="startDateTime"
              required
              className="w-full p-3 border border-[#8D6A93]/30 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
            >
              <option value="">Selecione um horário</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {new Date(t).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-[#8A4B2E] italic px-1">
              Escolha um serviço e uma data para ver os horários disponíveis.
            </p>
          )}

          {/* Botão */}
          <button
            className="
              w-full bg-[#1F3924] text-[#FFFEF9] 
              font-medium px-4 py-3 
              rounded-xl text-lg shadow-md
              hover:bg-[#8D6A93] transition-colors
            "
          >
            Confirmar Agendamento
          </button>
        </form>

        {/* Card de sucesso */}
        {successData && (
          <SuccessCard
            show
            onClose={() => setSuccessData(null)}
            {...successData}
          />
        )}

        {/* Toast de erro/alerta */}
        {msg && (
          <Toast
            message={msg}
            type={msgType || "error"}
            onClose={() => setMsg(null)}
          />
        )}
      </main>

      {/* Seção de promoções / eventos abaixo do card */}
      <EventPromo />
    </>
  );
}