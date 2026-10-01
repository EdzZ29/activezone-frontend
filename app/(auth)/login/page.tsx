import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/api/server";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  robots: { index: false },
};

/** Only allow redirects back into the dashboard (prevents open redirects). */
function safeNext(next: unknown) {
  return typeof next === "string" && next.startsWith("/dashboard") && !next.startsWith("//") ? next : "/dashboard";
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await getSession()) redirect(next);

  return (
    <>
      <p className="font-display text-[0.72rem] font-bold uppercase tracking-[0.28em] text-brand">Welcome back</p>
      <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-[-0.02em] text-white">Log in</h1>
      <p className="mt-3 text-zinc-400">Members, customers and ActiveZone staff sign in here.</p>

      <LoginForm next={next} />

      <p className="mt-8 text-sm text-zinc-400">
        New to ActiveZone?{" "}
        <Link href="/register" className="font-semibold text-white underline-offset-4 hover:text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
