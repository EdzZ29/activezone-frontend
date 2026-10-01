import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/app/components/dashboard/ui";
import { requireRole } from "@/lib/api/server";
import { ClientsList } from "./ClientsList";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  await requireRole("ADMIN", "STAFF");
  return (
    <Suspense fallback={<Loading />}>
      <ClientsList />
    </Suspense>
  );
}
