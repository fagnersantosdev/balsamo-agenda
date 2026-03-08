export type Testimonial = {
  id: number;
  author: string | null;
  message: string;
  rating: number;
  approved: boolean; // ⬅️ Verifique se estava "approvede" e apague o "e" extra
  createdAt: string; // ou Date, dependendo de como você usa
  photoUrl?: string | null;
};