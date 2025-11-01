import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import AdminPageClient from "./AdminPageClient";

export default async function AdminPage() {
  // ✅ Agora cookies() é assíncrono
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 🔒 Se não tiver token → redireciona
  if (!token) {
    redirect("/login");
  }

  try {
    // Verifica validade do token JWT
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }

  // ✅ Se passou pela verificação, renderiza o painel admin client-side
  return <AdminPageClient />;
}
