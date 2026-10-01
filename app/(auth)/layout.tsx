import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/app/components/Logo";
import { images } from "@/lib/content";
import { site } from "@/lib/site";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden /> Website
          </Link>
        </div>
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">{children}</main>
        <p className="text-xs text-zinc-600">
          © 2026 {site.name} · {site.address.short}
        </p>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <Image src={images.pages.membership} alt="" fill preload sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />
        <div aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-brand" />
        <div className="absolute inset-x-0 bottom-0 p-14">
          <p className="max-w-md font-display text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] text-white">
            Train strong. <span className="text-brand">Be active.</span>
          </p>
          <p className="mt-5 max-w-sm text-zinc-300">
            Track your membership, visits and classes, all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
