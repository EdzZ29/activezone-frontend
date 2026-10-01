import type { ClientRow } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { Badge } from "./ui";

/** Access status for a member/customer row: active plan, day pass, or none. */
export function ClientStatus({ client }: { client: Pick<ClientRow, "role" | "status" | "planName" | "accessEndsAt"> }) {
  if (client.status === "DISABLED") return <Badge tone="red">Disabled</Badge>;
  if (client.planName && client.accessEndsAt) {
    const until = formatDate(client.accessEndsAt, { month: "short", day: "numeric" });
    return <Badge tone={client.role === "MEMBER" ? "green" : "blue"}>{`${client.planName} · until ${until}`}</Badge>;
  }
  return <Badge tone="gray">No active plan</Badge>;
}
