import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();
    const token = req.headers.get("cookie")?.match(/admin_token=([^;]+)/)?.[1];
    if (!token) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });

    if (!admin) return NextResponse.json({ error: "Admin não encontrado." }, { status: 404 });

    const valid = await bcrypt.compare(oldPassword, admin.password);
    if (!valid)
      return NextResponse.json({ error: "Senha atual incorreta." }, { status: 401 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });

    return NextResponse.json({ ok: true, message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao alterar senha." }, { status: 500 });
  }
}
