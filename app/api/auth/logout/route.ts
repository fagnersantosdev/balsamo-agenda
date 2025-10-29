import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Logout efetuado." });
  response.cookies.set("admin_token", "", { path: "/", maxAge: 0 });
  return response;
}
