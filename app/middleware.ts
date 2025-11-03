import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// ✅ Define as rotas protegidas (tudo que começa com /admin)
const protectedRoutes = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔒 Verifica se a rota é protegida
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  // 🔍 Busca o token
  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.warn("🚫 Acesso sem token, redirecionando para login...");
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 🔑 Verifica se o token é válido
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // ✅ Tudo certo → segue pra rota
  } catch (err) {
    console.error("⚠️ Token inválido ou expirado:", err);
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

// ⚙️ Define onde o middleware será aplicado
export const config = {
  matcher: [
    "/admin/:path*", // Aplica a todas as rotas dentro de /admin
  ],
};
