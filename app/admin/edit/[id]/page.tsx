"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Save, User, Phone, Mail, Clock, Sparkles, CheckCircle2, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookingCalendar from "@/app/components/BookingCalendar";

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

type Availability = {
  id: number;
  dayOfWeek: number;
  openHour: number;
  closeHour: number;
  active: boolean;
};

export default function EditBookingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // 🔹 Estado para controlar o modal de sucesso final
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingRes, servicesRes, availabilityRes] = await Promise.all([
          fetch(`/api/bookings/${id}`),
          fetch(`/api/services`),
          fetch(`/api/availability`), 
        ]);

        const bookingData = await bookingRes.json();
        const servicesData = await servicesRes.json();
        const availabilityData = await availabilityRes.json();

        setBooking(bookingData);
        setServices(servicesData);
        setAvailability(availabilityData);

        if (bookingData.startDateTime) {
          const dateObj = new Date(bookingData.startDateTime);
          setSelectedDate(dateObj);
          
          const localTime = dateObj.toLocaleTimeString("pt-BR", { 
            hour: '2-digit', minute: '2-digit', hour12: false 
          });
          setSelectedTime(localTime);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    async function loadAvailableTimes() {
      if (!selectedDate || !booking?.serviceId) return;

      setLoadingTimes(true);
      setAvailableTimes([]);

      try {
        const dayISO = selectedDate.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
        
        const res = await fetch(`/api/availability-times?date=${dayISO}&serviceId=${booking.serviceId}&currentBookingId=${id}`);
        
        if (res.ok) {
          const times = await res.json();
          setAvailableTimes(times);
          
          if (booking.startDateTime) {
              const originalDateStr = new Date(booking.startDateTime).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
              if (dayISO !== originalDateStr) {
                  setSelectedTime("");
              }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar horários", error);
      } finally {
        setLoadingTimes(false);
      }
    }

    loadAvailableTimes();
  }, [selectedDate, booking?.serviceId, booking?.startDateTime, id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!booking) return;
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: name === "serviceId" ? Number(value) : value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!booking || !selectedDate || !selectedTime) {
      setMessage({ text: "Por favor, selecione uma data e um horário.", type: "error" });
      return;
    }

    setSaving(true);
    setMessage(null);

    const [hour, minute] = selectedTime.split(":").map(Number);
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(hour, minute, 0, 0);

    const payload = {
      ...booking,
      startDateTime: startDateTime.toISOString(),
    };

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Em vez de redirecionar direto, abrimos o modal
        setShowSuccessModal(true);
      } else {
        setMessage({ text: "Erro ao atualizar o agendamento.", type: "error" });
      }
    } catch {
      setMessage({ text: "Falha ao se conectar com o servidor.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  // 🔹 Lógica do WhatsApp (Gerada apenas quando o modal for abrir)
  const getWhatsAppLink = () => {
    if (!booking || !selectedDate) return "";
    
    const phoneNumber = booking.clientPhone.startsWith("55")
      ? booking.clientPhone
      : `55${booking.clientPhone.replace(/\D/g, "")}`;
      
    const serviceName = services.find(s => s.id === booking.serviceId)?.name || "nosso serviço";
    const formattedDate = selectedDate.toLocaleDateString('pt-BR');

    const whatsMessage = `🌿 Olá ${booking.clientName}! Passando para confirmar que seu agendamento de *${serviceName}* foi atualizado com sucesso para o dia *${formattedDate}* às *${selectedTime}*. Qualquer dúvida, estamos à disposição 💆‍♀️✨`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsMessage)}`;
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-[#F5F3EB]/50 border border-[#8D6A93]/20 rounded-2xl focus:ring-2 focus:ring-[#8D6A93]/50 focus:bg-white outline-none transition-all text-[#1F3924] font-medium";
  const labelClass = "flex items-center gap-2 text-xs font-black text-[#1F3924]/60 uppercase tracking-widest mb-2";

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 opacity-50">
      <div className="animate-spin w-8 h-8 border-4 border-[#8D6A93] border-t-transparent rounded-full mb-4"></div>
      <p className="text-[#083536] font-medium">Carregando dados...</p>
    </div>
  );

  if (!booking) return <p className="text-center py-10 text-red-600 font-bold">Agendamento não encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-1">
      <button 
        onClick={() => router.push("/admin")}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#083536]/60 hover:text-[#8D6A93] transition-colors mb-6 group"
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        Voltar para o Painel
      </button>

      <main className="relative bg-white rounded-[2.5rem] shadow-sm border border-[#8D6A93]/10 p-6 sm:p-10 overflow-hidden">
        <h1 className="text-3xl font-bold text-[#083536] mb-8">Editar Agendamento</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-bold text-center ${
            message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#97709B] border-b border-[#8D6A93]/10 pb-2 mb-4">Dados do Cliente</h3>
            
            <div>
              <label className={labelClass}>Nome do Cliente</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#97709B]/50 w-4 h-4" />
                <input type="text" name="clientName" value={booking.clientName} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#97709B]/50 w-4 h-4" />
                  <input type="text" name="clientPhone" value={booking.clientPhone} onChange={handleChange} className={inputClass} required />
                </div>
              </div>
              <div>
                <label className={labelClass}>E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#97709B]/50 w-4 h-4" />
                  <input type="email" name="clientEmail" value={booking.clientEmail || ""} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
             <h3 className="text-sm font-bold text-[#97709B] border-b border-[#8D6A93]/10 pb-2 mb-4">Serviço e Data</h3>
             
             <div>
              <label className={labelClass}>Serviço</label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-[#97709B]/50 w-4 h-4" />
                <select name="serviceId" value={booking.serviceId} onChange={handleChange} className={inputClass}>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className={labelClass}>Escolha a nova data</label>
              <BookingCalendar 
                selected={selectedDate} 
                availability={availability} 
                onSelect={(d) => setSelectedDate(d ?? null)} 
              />
            </div>

            {selectedDate && (
              <div className="pt-2 animate-fadeIn">
                <label className={labelClass}>Horário disponível</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#97709B]/50 w-4 h-4" />
                  <select 
                    value={selectedTime} 
                    onChange={(e) => setSelectedTime(e.target.value)} 
                    disabled={loadingTimes}
                    className={inputClass}
                    required
                  >
                    <option value="">{loadingTimes ? "Buscando horários..." : "Selecione o horário"}</option>
                    {availableTimes.map((t) => <option key={t} value={t}>{t}</option>)}
                    
                    {selectedTime && !availableTimes.includes(selectedTime) && !loadingTimes && (
                        <option value={selectedTime}>{selectedTime} (Horário Atual)</option>
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || !selectedTime}
            className="w-full bg-[#083536] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-[#083536]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-[#083536]/20"
          >
            {saving ? "Salvando..." : <><Save size={18} /> Salvar Alterações</>}
          </button>
        </form>
      </main>

      {/* 🛑 Modal de Confirmação e WhatsApp */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#083536]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#FAF8ED] rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full text-center border border-[#8D6A93]/10 relative overflow-hidden"
            >
              <button 
                onClick={() => router.push("/admin")}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>

              <h2 className="text-2xl font-bold text-[#083536] mb-3 tracking-tight">
                Alteração Concluída!
              </h2>
              
              <p className="text-[#083536]/60 mb-8 leading-relaxed text-sm">
                O agendamento de <span className="font-bold text-[#083536]">{booking.clientName}</span> foi atualizado. Deseja avisar o cliente no WhatsApp?
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => router.push("/admin")}
                  className="group flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#25D366] text-[#FAF8ED] font-bold shadow-lg shadow-green-200 hover:bg-[#20bd5a] transition-all active:scale-95"
                >
                  <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                  Avisar no WhatsApp
                </a>

                <button
                  onClick={() => router.push("/admin")}
                  className="w-full py-4 rounded-2xl font-bold text-[#FAF8ED] bg-[#083536] shadow-lg shadow-[#1F3924]/10 hover:bg-[#083536]/90 transition-all active:scale-95"
                >
                  Apenas Voltar ao Painel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}