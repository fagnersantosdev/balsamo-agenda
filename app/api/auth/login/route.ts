import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 🔍 Procura a admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    // 🔐 Verifica senha
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Senha incorreta." },
        { status: 401 }
      );
    }

    // 🔑 Cria token JWT (JOSE)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const token = await new SignJWT({
      id: admin.id,
      email: admin.email,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    const response = NextResponse.json({
      ok: true,
      message: "Login realizado com sucesso!",
    });

    // 🍪 Cookie seguro
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
