import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

/**
 * 🔒 Valida o token JWT e garante que o admin ainda exista no banco.
 * Retorna o admin autenticado ou redireciona para /login se inválido.
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
    };

    const admin = await prisma.admin.findUnique({
      where: { email: decoded.email },
    });

    if (!admin) {
      redirect("/login");
    }

    return admin;
  } catch (error) {
    console.error("❌ Erro de autenticação:", error);
    redirect("/login");
  }
}
