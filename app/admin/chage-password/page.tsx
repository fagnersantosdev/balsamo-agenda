import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePasswordPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }

  return (
    <main className="max-w-md mx-auto mt-28 p-6 bg-white rounded-2xl shadow-lg border border-[#8D6A93]/30">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6 text-center">
        🔐 Alterar Senha
      </h1>
      <ChangePasswordForm />
    </main>
  );
}
