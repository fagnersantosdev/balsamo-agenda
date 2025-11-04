import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Logout realizado com sucesso." });

  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0, // expira imediatamente
  });

  return response;
}
