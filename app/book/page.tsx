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

type Booking = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  serviceId: number;
};


export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [successData, setSuccessData] = useState<{
    name: string;
    date: string;
    service: string;
    phone?: string;
  } | null>(null);

  // 🔄 Carregar serviços e horários de funcionamento
  useEffect(() => {
  (async () => {
    try {
      const resServices = await fetch("/api/services");
      if (resServices.ok) {
        const dataServices = await resServices.json();
        setServices(Array.isArray(dataServices) ? dataServices : []);
      } else {
        setServices([]);
      }

      const resAvail = await fetch("/api/availability");
      if (resAvail.ok) {
        const text = await resAvail.text();
        const dataAvail = text ? JSON.parse(text) : [];
        setAvailability(Array.isArray(dataAvail) ? dataAvail : []);
      } else {
        console.warn("Erro ao buscar availability:", resAvail.status);
        setAvailability([]);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setServices([]);
      setAvailability([]);
    }
  })();
}, []);

// 🕒 Gera horários livres com base no expediente
async function loadAvailableTimes(date: string, serviceId: number) {
  if (!serviceId || !date) return;

  const res = await fetch("/api/bookings");
  let bookings: Booking[] = [];

  if (res.ok) {
    bookings = await res.json();
  } else {
    console.warn("Falha ao carregar agendamentos:", res.status);
  }

  const selectedDate = new Date(date);

  // ⚙️ Corrige o cálculo para alinhar com o banco (Segunda = 0, Domingo = 6)
  const jsDay = selectedDate.getDay();
  //rotaciona os dias: domingo (0) = 1, 
  //segunda (1) = 2, ...., sábado (6) = 0
  const dayOfWeek = (jsDay + 1) % 7;
  const dayAvailability = availability.find((a) => a.dayOfWeek === dayOfWeek);

  console.log("📅 Dia selecionado:", jsDay, "→ convertido para:", dayOfWeek);
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
    for (let m = 0; m < 60; m += 60) {
      const slot = new Date(selectedDate);
      slot.setHours(h, m, 0, 0);

      // 🔎 Verifica conflitos com reservas existentes
      const hasConflict = bookings.some((b: Booking) => {
        const start = new Date(b.startDateTime);
        const end = new Date(b.endDateTime);
        return slot >= start && slot < end;
      });

      if (!hasConflict) {
        times.push(slot.toISOString());
      }
    }
  }

  console.log("🕓 Horários disponíveis:", times.map(t =>
    new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  ));

  setAvailableTimes(times);
}


  // 📤 Submissão do agendamento
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    setSuccessData(null);

    const formElement = e.currentTarget;
    const form = new FormData(formElement);

    const rawPhone = (form.get("clientPhone") as string) || "";
    const cleanedPhone = rawPhone.replace(/\D/g, "");

    const payload = {
    clientName: form.get("clientName"),
    clientPhone: cleanedPhone,
    clientEmail: form.get("clientEmail") || null,
    serviceId: Number(form.get("serviceId")),
    startDateTime: form.get("startDateTime") || (selectedDate ? selectedDate.toISOString() : null),
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
      setSuccessData({
        name: booking.clientName,
        date: new Date(booking.startDateTime).toLocaleString("pt-BR"),
        service: booking.service.name,
        phone: booking.clientPhone,
      });

      formElement.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMsgType("success");
      setMsg("✨ Agendamento realizado com sucesso!");
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

        <h1 className="flex items-center gap-2 text-2xl font-bold text-[#1F3924]">
          <Image src="/borboleta.png" alt="Borboleta" width={50} height={50} />
          Agendar Atendimento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campos padrão */}
          <input name="clientName" required placeholder="Nome completo" className="w-full p-2 border rounded" />
          <input name="clientPhone" required placeholder="(24) 99999-9999" className="w-full p-2 border rounded" />
          <input name="clientEmail" placeholder="E-mail (opcional)" className="w-full p-2 border rounded" />

          {/* Serviço */}
          <select
            name="serviceId"
            required
            className="w-full p-2 border rounded"
            onChange={(e) => {
              const date = (document.querySelector("[name='date']") as HTMLInputElement)?.value;
              if (date) loadAvailableTimes(date, Number(e.target.value));
            }}
          >
            <option value="">Selecione um serviço</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Data */}
          <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Escolha a data</label>

          <div className="bg-white rounded-xl border border-purple-200 p-3 shadow-sm">
            <DayPicker
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={(date) => {
                if (!date) return;

                const day = date.getDay(); // 0 = domingo, 6 = sábado
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
                  // envia a data formatada (yyyy-mm-dd)
                  const formatted = date.toISOString().split("T")[0];
                  loadAvailableTimes(formatted, serviceId);
                }
              }}
              disabled={(date) => {
                const day = date.getDay();
                // Desabilita sábado e domingo no calendário
                return day === 0 || day === 6;
              }}
              locale={ptBR}
              weekStartsOn={1}
              styles={{
                day: { fontSize: "0.9rem" },
                caption: { color: "#1F3924", fontWeight: "bold" },
                head_cell: { color: "#8A4B2E" },
              }}
            />
          </div>
        </div>



          {/* Horários disponíveis */}
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
