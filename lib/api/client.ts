/**
 * Browser-side API client. Requests go to /api on this site, which Next.js
 * rewrites to the backend (see next.config.ts), so the session cookie is first-party.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    /** Extra fields from the error body, e.g. the person behind a NO_ACTIVE_ACCESS response. */
    public data?: Record<string, unknown>,
  ) {
    super(message);
  }
}

type Options = { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; signal?: AbortSignal };

export async function api<T>(path: string, { method = "GET", body, signal }: Options = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      signal,
      credentials: "same-origin",
      headers: body !== undefined ? { "content-type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // Nest validation errors return an array of messages.
    const raw = data?.message;
    const message = Array.isArray(raw) ? raw[0] : typeof raw === "string" ? raw : null;
    throw new ApiError(
      res.status,
      message ?? (res.status >= 500 ? "Something went wrong on our side. Please try again." : "Request failed."),
      data?.code,
      data ?? undefined,
    );
  }
  return data as T;
}

export function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}
