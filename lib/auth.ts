import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

/**
 * 🔒 Middleware server-side para proteger páginas administrativas
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies(); // ✅ Next 15+ precisa de await
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
