import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

/**
 * Protege rotas administrativas.
 * Redireciona para /login se o token for inválido ou inexistente.
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies(); // ✅ necessário no Next 15+
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }
}
