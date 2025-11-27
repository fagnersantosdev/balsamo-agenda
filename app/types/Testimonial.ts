export interface Testimonial {
  id: number;
  author: string;
  message: string;
  rating: number | null;
  suggestion?: string | null;
  createdAt: string;
}