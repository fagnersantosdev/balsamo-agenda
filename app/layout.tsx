import "./globals.css";
import Link from "next/link";


export const metadata = {
  title: "Bálsamo Massoterapia",
  description: "Agendamento online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-b from-emerald-50 to-white text-slate-800">
        <header className="bg-emerald-600 text-white py-4 shadow">
          <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Bálsamo Massoterapia</h1>
            <nav>
              <Link href="/" className="hover:underline mr-4">Início</Link>
              <Link href="/book" className="hover:underline">Agendar</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-slate-500 mt-12">
          © {new Date().getFullYear()} Bálsamo Massoterapia — Todos os direitos reservados.
        </footer>
      </body>
    </html>
  );
}
