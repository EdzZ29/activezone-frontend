"use client";

import { createContext, useContext } from "react";
import type { Session } from "@/lib/api/types";

export const SessionContext = createContext<Session | null>(null);

/** The signed-in user and their current access, loaded by app/dashboard/layout.tsx. */
export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used inside the dashboard");
  return session;
}
