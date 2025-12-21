import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
  } catch {
    redirect("/login");
  }
}
