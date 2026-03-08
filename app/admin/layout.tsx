import { ReactNode } from "react";
import { requireAdminAuth } from "@/lib/auth";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdminAuth(); // 🔒 proteção única e global
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
