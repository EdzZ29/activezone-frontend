"use client";

import { useState } from "react";
import { KeyRound, UserPlus } from "lucide-react";
import { NewUserModal, TempPassword } from "@/app/components/dashboard/forms";
import { useSession } from "@/app/components/dashboard/session";
import { useToast } from "@/app/components/dashboard/toast";
import { Async, Badge, Modal, PageHeader, Panel, Table } from "@/app/components/dashboard/ui";
import { buttonClasses } from "@/app/components/ui/Button";
import { api, errorMessage } from "@/lib/api/client";
import type { ClientRow, Role } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { formatDate, fullName } from "@/lib/format";

export function TeamList() {
  const { user: me } = useSession();
  const toast = useToast();
  const admins = useApi<ClientRow[]>("/users?role=ADMIN&limit=200");
  const staff = useApi<ClientRow[]>("/users?role=STAFF&limit=200");
  const [creating, setCreating] = useState(false);
  const [reset, setReset] = useState<{ name: string; password: string } | null>(null);

  const reload = () => {
    admins.reload();
    staff.reload();
  };

  async function update(id: string, body: { role?: Role; status?: "ACTIVE" | "DISABLED" }, message: string) {
    try {
      await api(`/users/${id}`, { method: "PATCH", body });
      toast(message);
      reload();
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  async function resetPassword(person: ClientRow) {
    if (!confirm(`Reset ${fullName(person)}'s password?`)) return;
    try {
      const res = await api<{ initialPassword: string }>(`/users/${person.id}/reset-password`, { method: "POST" });
      setReset({ name: fullName(person), password: res.initialPassword });
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Team"
        description="Staff can run the front desk, manage clients, classes and inquiries. Admins can also set prices, see payments and manage the team."
        actions={
          <button type="button" onClick={() => setCreating(true)} className={buttonClasses("primary", "md")}>
            <UserPlus size={16} aria-hidden /> Add team member
          </button>
        }
      />

      <Panel padded={false}>
        <Async state={admins}>
          {(adminRows) => (
            <Async state={staff}>
              {(staffRows) => (
                <Table head={["Name", "Email", "Role", "Status", "Added", ""]}>
                  {[...adminRows, ...staffRows].map((p) => {
                    const self = p.id === me.id;
                    return (
                      <tr key={p.id}>
                        <td className="px-5 py-3.5 font-medium text-white">
                          {fullName(p)} {self && <span className="ml-1 text-xs text-zinc-500">(you)</span>}
                        </td>
                        <td className="px-5 py-3.5 text-zinc-400">{p.email}</td>
                        <td className="px-5 py-3.5">
                          {self ? (
                            <Badge tone="green">Admin</Badge>
                          ) : (
                            <select
                              aria-label={`Role for ${fullName(p)}`}
                              value={p.role}
                              onChange={(e) => update(p.id, { role: e.target.value as Role }, "Role updated.")}
                              className="border border-white/10 bg-ink-950 px-2 py-1.5 text-sm text-white focus:border-brand focus:outline-none"
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="STAFF">Staff</option>
                              <option value="CUSTOMER">Remove from team</option>
                            </select>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge tone={p.status === "ACTIVE" ? "green" : "red"}>{p.status === "ACTIVE" ? "Active" : "Disabled"}</Badge>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-400">{formatDate(p.createdAt)}</td>
                        <td className="px-5 py-3.5">
                          {!self && (
                            <div className="flex justify-end gap-3 text-xs font-semibold">
                              <button type="button" onClick={() => resetPassword(p)} className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">
                                <KeyRound size={13} aria-hidden /> Reset
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  update(
                                    p.id,
                                    { status: p.status === "ACTIVE" ? "DISABLED" : "ACTIVE" },
                                    p.status === "ACTIVE" ? "Account disabled." : "Account enabled.",
                                  )
                                }
                                className={p.status === "ACTIVE" ? "text-zinc-400 hover:text-red-300" : "text-brand hover:underline"}
                              >
                                {p.status === "ACTIVE" ? "Disable" : "Enable"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </Table>
              )}
            </Async>
          )}
        </Async>
      </Panel>

      <NewUserModal open={creating} onClose={() => setCreating(false)} onCreated={reload} roles={["STAFF", "ADMIN"]} title="Add team member" />

      <Modal open={reset !== null} onClose={() => setReset(null)} title="Password reset">
        {reset && <TempPassword password={reset.password} who={reset.name} />}
      </Modal>
    </>
  );
}
