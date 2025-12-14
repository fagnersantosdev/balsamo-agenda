import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 🔍 Procura a admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    // 🔐 Verifica senha
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    // 🔑 Cria token JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role:"admin" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ ok: true, message: "Login realizado com sucesso!" });
    // 🍪 Define cookie seguro e compatível com desenvolvimento e produção
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      sameSite: "lax", // 🔹 permite redirecionamento e é mais estável que 'strict'
      secure: process.env.NODE_ENV === "production", // true apenas em deploy (Vercel)
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    });


    return response;
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
