"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Search, UserPlus } from "lucide-react";
import { ClientStatus } from "@/app/components/dashboard/ClientStatus";
import { NewUserModal } from "@/app/components/dashboard/forms";
import { Async, EmptyState, PageHeader, Panel, Table, Tabs } from "@/app/components/dashboard/ui";
import { buttonClasses } from "@/app/components/ui/Button";
import type { ClientRow, Plan, Role } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { formatDate, fullName } from "@/lib/format";

type Filter = "ALL" | "MEMBER" | "CUSTOMER";

export function ClientsList() {
  const router = useRouter();
  const params = useSearchParams();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [creating, setCreating] = useState(params.get("new") === "1");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const search = new URLSearchParams({ limit: "200" });
  if (filter !== "ALL") search.set("role", filter);
  if (debounced) search.set("q", debounced);
  const clients = useApi<ClientRow[]>(`/users?${search}`);
  const plans = useApi<Plan[]>("/plans");

  return (
    <>
      <PageHeader
        title="Clients"
        description="Members have an active membership plan. Customers are registered but don't have one right now."
        actions={
          <button type="button" onClick={() => setCreating(true)} className={buttonClasses("primary", "md")}>
            <UserPlus size={16} aria-hidden /> Add client
          </button>
        }
      />

      <Panel padded={false}>
        <div className="flex flex-col gap-3 px-5 pt-4 md:flex-row md:items-center md:justify-between">
          <Tabs<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "MEMBER", label: "Members" },
              { value: "CUSTOMER", label: "Customers" },
            ]}
          />
          <div className="relative md:w-72">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, email"
              aria-label="Search clients"
              className="w-full border border-white/10 bg-ink-950 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-2">
          <Async state={clients}>
            {(rows) =>
              rows.length === 0 ? (
                <EmptyState title={debounced ? "No matches" : "No clients yet"}>
                  {debounced ? "Try a different name or number." : "Add your first client to get started."}
                </EmptyState>
              ) : (
                <Table head={["Name", "Contact", "Status", "Joined", ""]}>
                  {rows.map((c) => (
                    <tr
                      key={c.id}
                      className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                      onClick={() => router.push(`/dashboard/clients/${c.id}`)}
                    >
                      <td className="px-5 py-3.5">
                        <Link href={`/dashboard/clients/${c.id}`} className="font-medium text-white hover:text-brand" onClick={(e) => e.stopPropagation()}>
                          {fullName(c)}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-400">
                        <span className="block">{c.phone ?? "No phone"}</span>
                        <span className="block text-xs text-zinc-500">{c.email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <ClientStatus client={c} />
                      </td>
                      <td className="px-5 py-3.5 text-zinc-400">{formatDate(c.createdAt)}</td>
                      <td className="px-5 py-3.5 text-right text-zinc-600">
                        <ChevronRight size={16} aria-hidden />
                      </td>
                    </tr>
                  ))}
                </Table>
              )
            }
          </Async>
        </div>
      </Panel>

      {plans.data && (
        <NewUserModal
          open={creating}
          title="Add client"
          roles={["CUSTOMER" satisfies Role]}
          plans={plans.data}
          onClose={() => {
            setCreating(false);
            if (params.get("new")) router.replace("/dashboard/clients");
          }}
          onCreated={() => clients.reload()}
        />
      )}
    </>
  );
}
