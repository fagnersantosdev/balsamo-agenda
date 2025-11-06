import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// ⚠️ Troque: import jwt from "jsonwebtoken";
import { jwtVerify } from 'jose'; // ✅ Novo import jose

// ... (Restante da lógica)

export async function middleware(req: NextRequest) {
  // ... (Lógica de verificação de rota e busca de token)

  const { pathname } = req.nextUrl;
  const protectedRoutes = ["/admin"]; // Garantindo que você tem essa definição, se não estiver globalmente
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.warn("🚫 Acesso sem token, redirecionando para login...");
    // Assumindo que /login é a rota principal de login
    const loginUrl = new URL("/login", req.url); 
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 🔑 CÓDIGO JOSE: Transforma o segredo em um formato que o jose entende
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!); 
    await jwtVerify(token, secret); // ✅ Verifica o token

    return NextResponse.next(); // ✅ Tudo certo → segue pra rota
  } catch (err) {
    console.error("⚠️ Token inválido ou expirado (Falha na verificação):", err);
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
