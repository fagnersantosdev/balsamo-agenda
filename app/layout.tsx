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
      <body className="min-h-screen bg-gradient-to-b from-purple-50 to-white text-green-900">

      <header className="relative bg-purple-200 text-green-900 py-3 shadow border-b border-purple-300/50">
      {/* Logo à esquerda em telas médias para cima */}
      <div className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 items-center gap-2">
        <Image
          src="/logo-balsamo.png"
          alt="Logotipo Bálsamo Massoterapia"
          width={50}
          height={50}
          priority
          className="transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>

      {/* Título centralizado e adaptável */}
      <h1 className="text-center text-lg sm:text-xl md:text-2xl font-bold tracking-wide select-none">
        Bálsamo Massoterapia
      </h1>

      {/* Navegação à direita (esconde em telas muito pequenas) */}
      <nav className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 space-x-3 sm:space-x-4 text-sm md:text-base">
        <Link href="/book" className="hover:underline hover:text-green-800">
          Agendar
        </Link>
        <Link href="/admin" className="hover:underline hover:text-green-800">
          Admin
        </Link>
      </nav>

      {/* Navegação em formato compacto (visível em telas pequenas) */}
      <div className="flex sm:hidden justify-center mt-2 space-x-4 text-sm">
        <Link href="/book" className="hover:underline hover:text-green-800">
          Agendar
        </Link>
        <Link href="/admin" className="hover:underline hover:text-green-800">
          Admin
        </Link>
      </div>
    </header>


        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>

           <footer>
      <footer className="bg-purple-200 text-green-900 mt-12 py-8">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        {/* Coluna 1: Logo e breve descrição */}
        <div>
          <div className="flex justify-center sm:justify-start items-center gap-2 mb-3">
            <Image
              src="/logo-balsamo.png"
              alt="Bálsamo Massoterapia"
              width={50}
              height={50}
              className="rounded"
            />
            <span className="font-bold text-lg">Bálsamo Massoterapia</span>
          </div>
          <p className="text-sm text-green-800">
            Cuidando do seu bem-estar com técnicas especializadas de massagem para aliviar dores e renovar suas energias.
          </p>
        </div>

        {/* Coluna 2: Contato */}
        <div>
          <h3 className="font-semibold mb-3">Contato</h3>
          {/* WhatsApp */}
          <p className="flex items-center justify-center sm:justify-start gap-2 text-sm mb-2">
            {/* Ícone WhatsApp */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-green-600"
            >
              <path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 0 11.99C0 5.373 5.373 0 11.99 0c3.192 0 6.2 1.244 8.477 3.522a11.87 11.87 0 0 1 3.522 8.478c0 6.617-5.373 11.99-11.99 11.99a11.87 11.87 0 0 1-5.847-1.494L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.365 1.591 5.448 0 9.884-4.435 9.884-9.884 0-5.448-4.436-9.884-9.884-9.884-5.448 0-9.884 4.436-9.884 9.884 0 2.088.691 3.78 1.65 5.37l-.999 3.648 3.868-1.725z" />
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.149-.197.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.67-1.611-.916-2.205-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.1 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
            </svg>
            <a href="https://wa.me/5524992640951" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-700">
              Whatsapp
            </a>
          </p>

          {/* E-mail */}
          <p className="text-sm mb-2">
            ✉ E-mail:{" "}
            <a href="mailto:contato@balsamo.com" className="underline hover:text-green-700">
              contato@balsamo.com
            </a>
          </p>

          {/* Instagram */}
          <p className="flex items-center justify-center sm:justify-start gap-2 text-sm">
            {/* Ícone Instagram */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-purple-600"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3a5.75 5.75 0 1 1 0 11.5 5.75 5.75 0 0 1 0-11.5zm0 1.5a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5zm5.25-.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
            </svg>
            <a href="https://www.instagram.com/balsamo_massoterapia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-700">
              @balsamo_massoterapia
            </a>
          </p>
          
          {/* Endereço e Google Maps */}
          <p className="text-sm flex flex-col sm:flex-row sm:items-center gap-1 mt-3">
             
            <a
              href="https://www.google.com/maps/place/B%C3%A1lsamo+Massoterapia/@-22.4652668,-44.4477236,15z/data=!4m6!3m5!1s0x9e7fa532740041:0x17986c0cbb30fdd3!8m2!3d-22.4652446!4d-44.4477309!16s%2Fg%2F11tk16ylrs?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-700"
            >
              📍 R. Albino de Almeida, 81 - sala 02 - Campos Elíseos, Resende - RJ, 27542-080
            </a>
          </p>
        </div>


        {/* Coluna 3: Links */}
        <div>
          <h3 className="font-semibold mb-3">Links Rápidos</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:underline hover:text-green-700">
                Serviços
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:underline hover:text-green-700">
                Agendar
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:underline hover:text-green-700">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-green-800 mt-8 border-t border-purple-300/50 pt-4">
        © {new Date().getFullYear()} Bálsamo Massoterapia — Todos os direitos reservados.
      </div>
    </footer>

      </footer>
      </body>
    </html>
  );
}
