export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAdminAuth } from "@/lib/auth";
import AdminPageClient from "./AdminPageClient";

export default async function AdminPage() {
  await requireAdminAuth(); // 🔐 Protege antes de renderizar
  return <AdminPageClient />;
}
