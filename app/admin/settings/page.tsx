import SettingsClient from "./SettingsClient";

export default function SettingsPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-[#1F3924]">
        ⚙️ Configurações do Sistema
      </h1>

      <SettingsClient />
    </main>
  );
}