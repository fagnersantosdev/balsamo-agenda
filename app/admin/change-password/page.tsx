import { requireAdminAuth } from "@/lib/auth";
import ChangePasswordForm from "./ChangePasswordForm";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function ChangePasswordPage() {
  // ✅ Mantém a proteção de servidor que você já tem
  await requireAdminAuth();

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        
        {/* Botão Voltar: Essencial para a experiência do Admin */}
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1F3924]/60 hover:text-[#8D6A93] transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para o Painel
        </Link>

        {/* Card Principal */}
        <div
          className="
            bg-white/80 backdrop-blur-md
            rounded-3xl
            shadow-[0_20px_50px_-15px_rgba(141,106,147,0.15)]
            border border-[#8D6A93]/15
            p-8
            transition-all
          "
        >
          {/* Cabeçalho Visual */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#8D6A93]/10 text-[#8D6A93] mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-[#1F3924]">
              Alterar Senha
            </h1>
            <p className="text-sm text-[#8D6A93] mt-2">
              Escolha uma senha forte para proteger seu acesso.
            </p>
          </div>

          {/* O formulário com o "olhinho" e loading que refinamos */}
          <ChangePasswordForm />
        </div>

        <p className="text-center text-[10px] text-[#1F3924]/30 mt-8 uppercase tracking-[0.2em] font-bold">
          Ambiente Seguro • Bálsamo
        </p>
      </div>
    </main>
  );
}