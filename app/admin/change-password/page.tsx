import { requireAdminAuth } from "@/lib/auth";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePasswordPage() {
  // 🔒 Garante que somente a admin logada acesse
  await requireAdminAuth();

  return (
    <main className="max-w-lg mx-auto bg-[#F5F3EB] rounded-2xl shadow-lg p-8 mt-8">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6 text-center">
        🔐 Alterar Senha
      </h1>
      <ChangePasswordForm />
    </main>
  );
}
