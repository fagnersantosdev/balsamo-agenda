"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Booking = {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  startDateTime: string;
  endDateTime: string;
  service: { name: string };
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/bookings").then((res) => res.json()).then(setBookings);
  }, []);

  return (
    <main className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-green-900 mb-4">
        <Image src="/borboleta.png" alt="Borboleta" width={50} height={50} /> Agendamentos</h1>
      {bookings.length === 0 ? (
        <p className="text-sm text-slate-600">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="divide-y">
          {bookings.map((b) => (
            <div key={b.id} className="py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{b.clientName} — {b.service.name}</div>
                <div className="text-sm text-slate-600">
                  {new Date(b.startDateTime).toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="text-sm text-slate-600">
                {b.clientPhone}{b.clientEmail ? ` • ${b.clientEmail}` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
