"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Phone, Mail, Sparkles, Clock, CalendarCheck } from "lucide-react";
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

export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);
  const [successData, setSuccessData] = useState<SuccessInfo | null>(null);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/availability").then((r) => r.json()).then(setAvailability);
  }, []);

  async function loadAvailableTimes(date: Date, serviceId: number) {
    setAvailableTimes([]);
    const dayISO = date.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    const res = await fetch(`/api/availability-times?date=${dayISO}&serviceId=${serviceId}`);
    if (!res.ok) return;
    const times: string[] = await res.json();
    setAvailableTimes(times);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget; 
    const formData = new FormData(formElement);
    const time = String(formData.get("startDateTime"));

    if (!selectedDate || !time) {
      setMsgType("error");
      setMsg("⚠️ Selecione data e horário.");
      return;
    }

    setLoading(true);
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

      if (!res.ok) {
        const data = await res.json();
        setMsgType("error");
        setMsg(data.error || "Este horário não está mais disponível.");
        return;
      }

      setSuccessData({
        name: String(formData.get("clientName")),
        date: startDateTime.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
        service: selectedService?.name || "",
      });

      formElement.reset(); 
      setSelectedServiceId(null);
      setSelectedService(null);
      setSelectedDate(null);
      setAvailableTimes([]);
      setMsgType("success");
      setMsg("✅ Agendamento realizado com sucesso!");

    } catch {
      setMsgType("error");
      setMsg("❌ Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full pl-12 pr-4 py-3 bg-white border border-[#8D6A93]/20 rounded-2xl focus:ring-2 focus:ring-[#8D6A93] outline-none transition-all text-[#1F3924] placeholder:text-gray-300";
  const labelClass = "block text-[10px] font-black uppercase tracking-widest text-[#1F3924]/40 ml-1 mb-1";

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="max-w-xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-[#8D6A93]/10 border border-[#8D6A93]/5 p-8 md:p-12 relative overflow-hidden">
          
          {/* Fundo Decorativo */}
          <div className="absolute top-0 right-0 p-8 opacity-5 text-[#8D6A93] pointer-events-none">
            <CalendarCheck size={120} />
          </div>

          <header className="flex flex-col items-center text-center mb-10">
            <div className="bg-[#F5F3EB] p-4 rounded-[2rem] mb-6 shadow-sm border border-[#D6A77A]/10">
              <Image src="/logo-balsamo.png" width={60} height={60} alt="Logo" className="object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-[#1F3924] tracking-tight">
              Reserve seu Momento
            </h1>
            <p className="text-sm text-[#1F3924]/80 mt-2 font-medium">
              Sua jornada de relaxamento começa aqui 🌿
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6A93]/60 w-5 h-5" />
                <input name="clientName" required placeholder="Nome completo" className={inputClass} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6A93]/60 w-5 h-5" />
                  <input name="clientPhone" required placeholder="WhatsApp" className={inputClass} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6A93]/60 w-5 h-5" />
                  <input name="clientEmail" type="email" placeholder="Email (opcional)" className={inputClass} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#8D6A93]/8">
              <div>
                <label className={labelClass}>O que você deseja hoje?</label>
                <div className="relative">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6A93]/60 w-5 h-5" />
                  <select
                    name="serviceId"
                    required
                    className={inputClass}
                    value={selectedServiceId ?? ""}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const s = services.find((sv) => sv.id === id) || null;
                      setSelectedServiceId(id);
                      setSelectedService(s);
                      setAvailableTimes([]);
                      if (selectedDate && s) loadAvailableTimes(selectedDate, s.id);
                    }}
                  >
                    <option value="">Escolha um tratamento</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="animate-fadeIn">
                <label className={labelClass}>Escolha o dia</label>
                <BookingCalendar
                  selected={selectedDate}
                  availability={availability}
                  onSelect={(date?: Date) => {
                    const d = date ?? null;
                    setSelectedDate(d);
                    setAvailableTimes([]);
                    if (d && selectedServiceId) loadAvailableTimes(d, selectedServiceId);
                  }}
                />
              </div>

              {selectedDate && availableTimes.length > 0 && (
                <div className="animate-slideDown">
                  <label className={labelClass}>Horários disponíveis</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6A93]/60 w-5 h-5" />
                    <select name="startDateTime" required className={inputClass}>
                      <option value="">Selecione a hora</option>
                      {availableTimes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#1F3924] text-[#FFFEF9] py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#1F3924]/20 hover:bg-[#2a4d31] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Processando..." : "Confirmar Agendamento"}
            </button>
          </form>
        </div>
      </main>

      <div className="pb-20">
        <EventPromo />
      </div>

      {successData && (
        <SuccessCard show onClose={() => setSuccessData(null)} {...successData} />
      )}

      {msg && (
        <Toast message={msg} type={msgType || "error"} onClose={() => setMsg(null)} />
      )}
    </>
  );
}