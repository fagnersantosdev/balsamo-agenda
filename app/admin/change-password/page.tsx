import { requireAdminAuth } from "@/lib/auth";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePasswordPage() {
  await requireAdminAuth();

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <div
        className="
          bg-white/80 backdrop-blur
          rounded-2xl
          shadow-[0_8px_28px_-10px_rgba(141,106,147,0.25)]
          border border-[#8D6A93]/20
          p-8
        "
      >
        <h1 className="text-2xl font-bold text-[#1F3924] mb-2 text-center">
          🔐 Alterar Senha
        </h1>

        <p className="text-sm text-[#8D6A93] text-center mb-6">
          Para sua segurança, escolha uma senha forte e exclusiva.
        </p>

        <ChangePasswordForm />
      </div>
    </main>
  );
}
