import { Service } from "./Service";

export type Booking = {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  startDateTime: string;
  status: "PENDENTE" | "CONCLUIDO" | "CANCELADO";
  service?: Service | null;
};
