import { requireAdminAuth } from "@/lib/auth";
import ServicesPageClient from "./ServicesPageClient"; // componente que já mostra a tela de serviços

export default async function ServicesPage() {
  // 🔒 Verifica autenticação do admin antes de renderizar
  await requireAdminAuth();

  // ✅ Renderiza o painel de serviços se estiver logado
  return <ServicesPageClient />;
}
