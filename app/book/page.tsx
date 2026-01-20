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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
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

  const dayISO = date.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo", });

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

  // ✅ REGRA DE OURO: Salve a referência do form ANTES de qualquer await
  const formElement = e.currentTarget; 
  const formData = new FormData(formElement);

  const time = String(formData.get("startDateTime"));

  if (!selectedDate || !time) {
    setMsgType("error");
    setMsg("Selecione data e horário.");
    return;
  }

  const [hour, minute] = time.split(":").map(Number);
  const startDateTime = new Date(selectedDate);
  startDateTime.setHours(hour, minute, 0, 0);

  const payload = {
    clientName: formData.get("clientName"),
    clientPhone: String(formData.get("clientPhone")).replace(/\D/g, ""),
    clientEmail: formData.get("clientEmail") || null,
    serviceId: Number(formData.get("serviceId")),
    startDateTime: startDateTime.toISOString(),
  };

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // ✅ TRATAMENTO DE ERRO SEM "TRAVAR" A TELA
    if (!res.ok) {
      const data = await res.json();
      setMsgType("error");
      setMsg(data.error || "Este horário não está mais disponível.");
      return; // Para a execução aqui e não tenta resetar o form
    }

    // ✅ SUCESSO
    setSuccessData({
      name: String(formData.get("clientName")),
      date: startDateTime.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      service: selectedService?.name || "",
    });

    // 🔄 LIMPAR FORMULÁRIO USANDO A REFERÊNCIA SALVA
    formElement.reset(); 

    setSelectedServiceId(null);
    setSelectedService(null);
    setSelectedDate(null);
    setAvailableTimes([]);

    setMsgType("success");
    setMsg("Agendamento realizado com sucesso!");

  } catch (err) {
    console.error("Erro ao realizar agendamento:", err);
    setMsgType("error");
    setMsg("Erro ao conectar com o servidor.");
  }
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

                const service = services.find((s) => s.id === id) || null;

                setSelectedServiceId(id);
                setSelectedService(service);
                setAvailableTimes([]);

                if (selectedDate && service) {
                  loadAvailableTimes(selectedDate, service.id);
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

            {selectedService && (
              <p className="text-sm text-[#1F3924]/70 mt-1">
                ⏱ Duração do atendimento: {selectedService.durationMin} minutos
              </p>
            )}

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
                    {t}
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
