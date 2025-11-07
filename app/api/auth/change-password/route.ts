import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 🔐 Pega o token do cookie de forma segura (sem parse manual)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // 🧠 Decodifica token (usa id ou email, conforme gerado no login)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id?: number; email: string };

    const { currentPassword, newPassword } = await req.json();

    // 🔍 Busca o admin autenticado
    const admin = await prisma.admin.findUnique({
      where: { email: decoded.email },
    });

    if (!admin) {
      return NextResponse.json({ error: "Administrador não encontrado." }, { status: 404 });
    }

    // 🔑 Verifica senha atual
    const validPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
    }

    // 🔒 Criptografa nova senha
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { email: decoded.email },
      data: { password: hashed },
    });

    return NextResponse.json({ ok: true, message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
