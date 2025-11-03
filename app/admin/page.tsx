import { requireAdminAuth } from "@/lib/auth";
import AdminPageClient from "./AdminPageClient";

export default async function AdminPage() {
  // 🔒 Autenticação obrigatória
  await requireAdminAuth();

  // ✅ Se passou, mostra o painel
  return <AdminPageClient />;
}
