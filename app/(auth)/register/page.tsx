import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/api/server";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false },
};

export default async function RegisterPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <>
      <p className="font-display text-[0.72rem] font-bold uppercase tracking-[0.28em] text-brand">Join ActiveZone</p>
      <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-[-0.02em] text-white">Create account</h1>
      <p className="mt-3 text-zinc-400">
        Keep track of your visits and request a membership online. Already training with us? The front desk can link
        your existing membership.
      </p>

      <RegisterForm />

      <p className="mt-8 text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-white underline-offset-4 hover:text-brand hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
