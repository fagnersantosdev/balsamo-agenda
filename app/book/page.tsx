"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Toast from "../components/toast";
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
  dayOfWeek: number; // 1=domingo ... 7=sábado
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
   MAPEAMENTO PARA COMBINAR COM A TABELA availability
============================================================ */
function mapDay(jsDay: number): number {
  // const map: Record<number, number> = {
  //   0: 1, //domingo
  //   1: 2, //...
  //   2: 3, //...
  //   3: 4, //...
  //   4: 5, //...
  //   5: 6, //...
  //   6: 7, //sabado
  // };
  return jsDay;
  //return map[jsDay];
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
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/availability").then((r) => r.json()).then(setAvailability);
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

    const now = new Date();
    now.setSeconds(0, 0);

    // Buscar agendamentos
    const res = await fetch("/api/bookings");
    const allBookings: Booking[] = res.ok ? await res.json() : [];

    const bookingsDoDia = allBookings.filter((b) => {
      const start = new Date(b.startDateTime);
      return start.toDateString() === selectedDate.toDateString();
    });

    // Disponibilidade do dia (corrigida)
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

      // Só bloqueia horários passados se o usuário selecionar o DIA REAL de hoje
    const todayReal = new Date();
    todayReal.setHours(0,0,0,0);

    if (selectedDate.toDateString() === todayReal.toDateString()) {
      if (slot.getTime() <= new Date().getTime()) continue;
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

    if (formEl) formEl.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ============================================================
     INTERFACE
  ============================================================ */
  return (
    <>
      <main className="relative max-w-lg mx-auto bg-[#F5F3EB] p-8 rounded-3xl shadow-xl border border-purple-100">

        <h1 className="flex items-center gap-2 text-2xl font-bold text-[#1F3924] mb-4">
          <Image src="/borboleta.png" width={50} height={50} alt="Borboleta" />
          Agendar Atendimento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input name="clientName" required placeholder="Nome completo" className="w-full p-2 border rounded" />
          <input name="clientPhone" required placeholder="(24) 99999-9999" className="w-full p-2 border rounded" />
          <input name="clientEmail" placeholder="E-mail (opcional)" className="w-full p-2 border rounded" />

          {/* Serviço */}
          <select
            name="serviceId"
            required
            className="w-full p-2 border rounded"
            onChange={(e) => {
              if (!selectedDate) return;
              loadAvailableTimes(selectedDate.toISOString().split("T")[0], Number(e.target.value));
            }}
          >
            <option value="">Selecione um serviço</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Calendário */}
          <DayPicker
            mode="single"
            selected={selectedDate ?? undefined}
            locale={ptBR}
            weekStartsOn={1}
            disabled={(d) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const dbDay = mapDay(d.getDay());
              return d < today || d.getDay() === 0 || d.getDay() === 6; // bloqueia domingo e sábado
            }}
            onSelect={(date) => {
              if (!date) return;

              setSelectedDate(date);

              const serviceId = Number(
                (document.querySelector("[name='serviceId']") as HTMLSelectElement)?.value
              );

              if (serviceId) {
                loadAvailableTimes(date.toISOString().split("T")[0], serviceId);
              }
            }}
          />

          {/* Horários */}
          {availableTimes.length > 0 ? (
            <select name="startDateTime" required className="w-full p-2 border rounded">
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
            <p className="text-sm text-[#8A4B2E] italic">
              Escolha um serviço e uma data para ver os horários disponíveis.
            </p>
          )}

          <button className="w-full bg-[#1F3924] text-purple-50 font-medium px-4 py-2 rounded-lg">
            Confirmar Agendamento
          </button>
        </form>

        {successData && (
          <SuccessCard show onClose={() => setSuccessData(null)} {...successData} />
        )}

        {msg && <Toast message={msg} type={msgType || "error"} onClose={() => setMsg(null)} />}

      </main>

      <EventPromo />
    </>
  );
}