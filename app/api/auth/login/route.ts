import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin)
      return NextResponse.json({ error: "Admin não encontrado." }, { status: 404 });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid)
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ ok: true, message: "Login efetuado com sucesso!" });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro no login." }, { status: 500 });
  }
}
