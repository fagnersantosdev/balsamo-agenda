import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET() {
  const cookieStore = await cookies(); // ✅ await obrigatório
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      authenticated: true,
      admin: payload,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
