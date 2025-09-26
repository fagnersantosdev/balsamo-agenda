import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Bálsamo Massoterapia",
  description: "Agendamento online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      {/* <body className="bg-gradient-to-b from-purple-50 to-white text-green-900"> */}
      <body style={{ backgroundColor: '#faf5ff' }} className="text-green-900">

        {/* Header roxo claro */}
        <header className="bg-purple-200 text-green-900 py-4 shadow">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo-balsamo.png"
                alt="Logotipo Bálsamo Massoterapia"
                width={74}
                height={74}
                priority
                className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              />
              <span className="text-lg font-semibold group-hover:text-green-800 transition-colors duration-300">
                Bálsamo Massoterapia
              </span>
            </Link>
            <nav>
              <Link href="/book" className="hover:underline mr-4">
                Agendar
              </Link>
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>

        <footer className="text-center text-xs text-green-800 mt-12">
          © {new Date().getFullYear()} Bálsamo Massoterapia — Todos os direitos reservados.
        </footer>
      </body>
    </html>
  );
}
