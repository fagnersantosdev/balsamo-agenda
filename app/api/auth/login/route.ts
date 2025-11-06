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
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // 🍪 Define cookie seguro
    const response = NextResponse.json({ ok: true, message: "Login realizado com sucesso!" });
    response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false, // Garantir que seja 'false'
        // ⚠️ Remova ou Comente a linha 'sameSite'
        // sameSite: "strict", 
        path: "/",
        maxAge: 60 * 60 * 24, 
    });

    return response;
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
