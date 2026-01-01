"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Toast from "../components/Toast";
import EventPromo from "../components/EventPromo";
import SuccessCard from "../components/SuccessCard";
import BookingCalendar from "@/app/components/BookingCalendar";

/* ============================================================
   TIPOS
============================================================ */
type Service = {
  id: number;
  name: string;
  durationMin: number;
};

type Availability = {
  id: number;
  dayOfWeek: number;
  openHour: number;
  closeHour: number;
  active: boolean;
};

type SuccessInfo = {
  name: string;
  date: string;
  service: string;
};

/* ============================================================
   COMPONENTE
============================================================ */
export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);
  const [successData, setSuccessData] = useState<SuccessInfo | null>(null);

  /* ============================================================
     LOAD INICIAL
  ============================================================ */
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices);

    fetch("/api/availability")
      .then((r) => r.json())
      .then(setAvailability);
  }, []);

  /* ============================================================
     HORÁRIOS DISPONÍVEIS
  ============================================================ */
  async function loadAvailableTimes(date: Date, serviceId: number) {
  setAvailableTimes([]);

  const dayISO = date.toISOString().split("T")[0];

  const res = await fetch(
    `/api/availability-times?date=${dayISO}&serviceId=${serviceId}`
  );

  if (!res.ok) return;

  const times: string[] = await res.json();
  setAvailableTimes(times);
}


  /* ============================================================
     SUBMIT
  ============================================================ */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

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
      setMsg(data.error || "Erro ao criar agendamento.");
      return;
    }

    setSuccessData({
      name: data.booking.clientName,
      date: new Date(data.booking.startDateTime).toLocaleString("pt-BR"),
      service: data.booking.service.name,
    });

    setAvailableTimes([]);
    setSelectedDate(null);
    setSelectedServiceId(null);
    e.currentTarget.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ============================================================
     UI
  ============================================================ */
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="max-w-xl mx-auto bg-[#F5F3EB] px-6 py-6 rounded-2xl shadow-xl border border-[#D6A77A]/40">
          {/* Header */}
          <div className="text-center mb-6">
            <Image src="/borboleta.png" width={48} height={48} alt="Bálsamo" />
            <h1 className="text-2xl font-bold text-[#1F3924] mt-2">
              Agende seu atendimento 🌿
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="clientName"
              required
              placeholder="Seu nome"
              className="w-full p-3 rounded-xl border"
            />

            <input
              name="clientPhone"
              required
              placeholder="Telefone"
              className="w-full p-3 rounded-xl border"
            />

            <input
              name="clientEmail"
              placeholder="Email (opcional)"
              className="w-full p-3 rounded-xl border"
            />

            {/* Serviço */}
            <select
              name="serviceId"
              required
              className="w-full p-3 rounded-xl border"
              value={selectedServiceId ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedServiceId(id);
                setAvailableTimes([]);

                if (selectedDate) {
                  loadAvailableTimes(selectedDate, id);
                }
              }}
            >
              <option value="">Selecione um serviço</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            
            {/* Calendário */}
            <BookingCalendar
              selected={selectedDate}
              availability={availability}
              onSelect={(date?: Date) => {
                const selected = date ?? null;
                setSelectedDate(selected);
                setAvailableTimes([]);

                if (selected && selectedServiceId) {
                  loadAvailableTimes(selected, selectedServiceId);
                }
              }}
            />

            {/* Horários */}
            {availableTimes.length > 0 && (
              <select
                name="startDateTime"
                required
                className="w-full p-3 rounded-xl border"
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
            )}


            <button className="w-full bg-[#1F3924] text-white py-3 rounded-xl hover:bg-[#8D6A93] transition">
              Confirmar agendamento
            </button>
          </form>
        </div>

        {successData && (
          <SuccessCard
            show
            onClose={() => setSuccessData(null)}
            {...successData}
          />
        )}

        {msg && (
          <Toast
            message={msg}
            type={msgType || "error"}
            onClose={() => setMsg(null)}
          />
        )}
      </main>

      <EventPromo />
    </>
  );
}
