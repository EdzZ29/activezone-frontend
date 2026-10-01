import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Role, Session } from "./types";

export const SESSION_COOKIE = "az_session";

/** Base URL of the NestJS API, e.g. http://localhost:4000 or https://activezone-api.onrender.com */
export function backendUrl() {
  return process.env.BACKEND_URL?.replace(/\/+$/, "") ?? null;
}

/** The signed-in user (validated by the API), or null. Deduplicated per request. */
export const getSession = cache(async (): Promise<Session | null> => {
  const base = backendUrl();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!base || !token) return null;

  try {
    const res = await fetch(`${base}/api/auth/me`, {
      headers: { cookie: `${SESSION_COOKIE}=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Session;
  } catch {
    return null;
  }
});

/** Use at the top of a dashboard page to restrict it to certain roles. */
export async function requireRole(...roles: Role[]): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!roles.includes(session.user.role)) redirect("/dashboard");
  return session;
}
