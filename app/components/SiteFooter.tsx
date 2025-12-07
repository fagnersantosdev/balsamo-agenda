"use client";

import { usePathname } from "next/navigation";

export default function SiteFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Oculta o footer em qualquer rota /admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <>{children}</>;
}