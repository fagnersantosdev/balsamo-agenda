import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const data = await req.json();
    const { currentPassword, newPassword } = data;

    const admin = await prisma.admin.findUnique({
      where: { email: decoded.email },
    });

    if (!admin) {
      return NextResponse.json({ error: "Administrador não encontrado." }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
    }

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
