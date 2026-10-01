import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/app/components/dashboard/ui";
import { requireRole } from "@/lib/api/server";
import { ClientDetail } from "./ClientDetail";

export const metadata: Metadata = { title: "Client" };

export default async function ClientPage({ params }: PageProps<"/dashboard/clients/[id]">) {
  await requireRole("ADMIN", "STAFF");
  const { id } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <ClientDetail id={id} />
    </Suspense>
  );
}
