"use client";
import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import Image from "next/image";
import Toast from "../components/toast";
import EventPromo from "../components/EventPromo";
import SuccessCard from "../components/SuccessCard";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { ptBR } from "date-fns/locale";

type Service = { id: number; name: string; durationMin: number };
type Availability = {
  dayOfWeek: number;
  openHour: number;
  closeHour: number;
  active: boolean;
};
type Booking = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  serviceId: number;
};

// Ícone de borboleta
function Butterfly(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M32 14v18" />
      <path d="M30 10c1 2 5 2 6 0" />
      <circle cx="33" cy="9" r="1.5" fill="currentColor" />
      <circle cx="31" cy="9" r="1.5" fill="currentColor" />
      <path d="M32 32c-7-10-19-14-25-9s-4 15 7 15c9 0 14-4 18-6" />
      <path d="M32 32c7-10 19-14 25-9s4 15-7 15c-9 0-14-4-18-6" />
    </svg>
  );
}

export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);
  const [successData, setSuccessData] = useState<{
    name: string;
    date: string;
    service: string;
    phone?: string;
  } | null>(null);

  // 🔄 Carrega serviços e disponibilidade
  useEffect(() => {
    fetch("/api/services").then((res) => res.json()).then(setServices);
    fetch("/api/availability").then((res) => res.json()).then(setAvailability);
  }, []);

  // 🕒 Gera horários livres com base no expediente
  async function loadAvailableTimes(date: string, serviceId: number) {
    if (!serviceId || !date) return;

    console.log("📅 Data selecionada:", date);

    const res = await fetch("/api/bookings");
    let bookings: Booking[] = [];

    if (res.ok) {
      bookings = await res.json();
    } else {
      console.warn("⚠️ Falha ao carregar agendamentos:", res.status);
    }

    const selectedDate = new Date(date);
    const jsDay = selectedDate.getDay();

    // 🔧 Corrige o mapeamento: sábado = 0, domingo = 1, segunda = 2...
    const dayOfWeek = (jsDay + 1) % 7;
    console.log(`🗓️ Dia JS: ${jsDay} → Banco dayOfWeek: ${dayOfWeek}`);

    const dayAvailability = availability.find((a) => a.dayOfWeek === dayOfWeek);
    console.log("🕘 Disponibilidade encontrada:", dayAvailability);

    if (!dayAvailability || !dayAvailability.active) {
      setAvailableTimes([]);
      setMsgType("error");
      setMsg("🚫 Este dia não está disponível para agendamento.");
      setTimeout(() => setMsg(null), 4000);
      return;
    }

    const times: string[] = [];
    for (let h = dayAvailability.openHour; h < dayAvailability.closeHour; h++) {
      const slot = new Date(selectedDate);
      slot.setHours(h, 0, 0, 0);

      const hasConflict = bookings.some((b: Booking) => {
        const start = new Date(b.startDateTime);
        const end = new Date(b.endDateTime);
        return slot >= start && slot < end;
      });

      if (!hasConflict) {
        times.push(slot.toISOString());
      }
    }

    console.log("✅ Horários disponíveis:", times);
    setAvailableTimes(times);
  }

  // 📤 Envia o agendamento
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    setSuccessData(null);

    const formElement = e.currentTarget;
    const form = new FormData(formElement);

    const rawPhone = (form.get("clientPhone") as string) || "";
    const cleanedPhone = rawPhone.replace(/\D/g, "");

    const startDateTime = form.get("startDateTime") as string;
    if (!startDateTime) {
      setMsgType("error");
      setMsg("⚠️ Selecione um horário antes de confirmar o agendamento.");
      setTimeout(() => setMsg(null), 4000);
      setLoading(false);
      return;
    }

    const payload = {
      clientName: form.get("clientName"),
      clientPhone: cleanedPhone,
      clientEmail: form.get("clientEmail") || null,
      serviceId: Number(form.get("serviceId")),
      startDateTime,
    };

    console.log("📦 Enviando payload:", payload);

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
      setSuccessData({
        name: booking.clientName,
        date: new Date(booking.startDateTime).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
        service: booking.service.name,
        phone: booking.clientPhone,
      });

      formElement.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMsgType("success");
      setMsg("✨ Agendamento realizado com sucesso!");
      setTimeout(() => setMsg(null), 4000);
    } catch (error) {
      console.error("❌ Erro inesperado ao agendar:", error);
      setMsgType("error");
      setMsg("Erro ao conectar com o servidor. Tente novamente.");
      setTimeout(() => setMsg(null), 4000);
    } finally {
      setLoading(false);
    }
  }

  // 🧭 Interface
  return (
    <>
      <main className="relative max-w-lg mx-auto bg-[#F5F3EB] backdrop-blur rounded-3xl shadow-xl p-8 border border-purple-100">
        <Butterfly className="absolute -top-4 -left-4 w-10 h-10 text-purple-500 rotate-12" />
        <Butterfly className="absolute -bottom-6 -right-6 w-12 h-12 text-[#1F3924] -rotate-12" />

        <h1 className="flex items-center gap-2 text-2xl font-bold text-[#1F3924] mb-4">
          <Image src="/borboleta.png" alt="Borboleta" width={50} height={50} />
          Agendar Atendimento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="clientName" required placeholder="Nome completo" className="w-full p-2 border rounded" />
          <input name="clientPhone" required placeholder="(24) 99999-9999" className="w-full p-2 border rounded" />
          <input name="clientEmail" placeholder="E-mail (opcional)" className="w-full p-2 border rounded" />

          <select
            name="serviceId"
            required
            className="w-full p-2 border rounded"
            onChange={(e) => {
              const date = selectedDate ? selectedDate.toISOString().split("T")[0] : "";
              if (date) loadAvailableTimes(date, Number(e.target.value));
            }}
          >
            <option value="">Selecione um serviço</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <div>
            <label className="block mb-2 font-medium text-[#1F3924]">Escolha a data</label>
            <div className="bg-white rounded-xl border border-purple-200 p-3 shadow-sm">
              <DayPicker
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={(date) => {
                  if (!date) return;
                  const day = date.getDay();
                  if (day === 0 || day === 6) {
                    setAvailableTimes([]);
                    setSelectedDate(null);
                    setMsgType("error");
                    setMsg("🚫 Não funcionamos aos fins de semana.");
                    setTimeout(() => setMsg(null), 4000);
                    return;
                  }
                  setSelectedDate(date);
                  const serviceId = Number(
                    (document.querySelector("[name='serviceId']") as HTMLSelectElement)?.value
                  );
                  if (serviceId) {
                    const formatted = date.toISOString().split("T")[0];
                    loadAvailableTimes(formatted, serviceId);
                  }
                }}
                disabled={(date) => {
                  const day = date.getDay();
                  return day === 0 || day === 6;
                }}
                locale={ptBR}
                weekStartsOn={1}
              />
            </div>
          </div>

          {availableTimes.length > 0 ? (
            <select name="startDateTime" required className="w-full p-2 border rounded">
              <option value="">Selecione um horário</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-[#8A4B2E] italic">
              Escolha um <strong>serviço</strong> e uma <strong>data válida (segunda a sexta)</strong> para ver os horários disponíveis.
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-[#1F3924] text-purple-50 font-medium px-4 py-2 rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50"
          >
            {loading ? "Agendando..." : "Confirmar Agendamento"}
          </button>
        </form>

        {successData && (
          <SuccessCard
            show
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
