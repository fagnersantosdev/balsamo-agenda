import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const { currentPassword, newPassword } = await req.json();
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });

    if (!admin) return NextResponse.json({ error: "Admin não encontrado." }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid)
      return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });

    return NextResponse.json({ message: "Senha atualizada com sucesso!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao alterar senha." }, { status: 500 });
  }
}
