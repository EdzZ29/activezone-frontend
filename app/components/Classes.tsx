import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import { classes, classesNote } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Classes() {
  return (
    <section id="classes" aria-label="Group classes" className="bg-ink-950 py-24 md:py-32">
      <div className="shell">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
          <SectionHeading
            eyebrow="Group Classes"
            title={["Move", "together"]}
          />
          <Reveal delay={100}>
            <p className="max-w-md text-base leading-relaxed text-zinc-400 md:text-lg lg:ml-auto">
              Training with others makes it easier to show up. Explore the session styles below and ask us
              what&apos;s on this week.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {classes.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={(i % 3) * 90}
              className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <article className="group flex h-full flex-col border border-white/[0.07] bg-ink-900 transition-colors duration-300 hover:border-white/20">
                <div className={`relative overflow-hidden bg-ink-800 ${i < 2 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                  <Image
                    src={item.image}
                    alt={`${item.name} session`}
                    fill
                    sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
                  <span className="absolute left-4 top-4 bg-black/60 px-2.5 py-1 font-display text-[0.62rem] font-bold uppercase tracking-[0.2em] text-zinc-200 backdrop-blur">
                    Ask for availability
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-white md:text-2xl">
                    {item.name}
                  </h3>
                  <p className="mt-2 leading-relaxed text-zinc-400">{item.description}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/[0.07] pt-5 text-sm">
                    <div>
                      <dt className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        <CalendarDays size={13} aria-hidden /> Schedule
                      </dt>
                      <dd className="mt-1 text-zinc-200">{item.schedule}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        <UserRound size={13} aria-hidden /> Coach
                      </dt>
                      <dd className="mt-1 text-zinc-200">{item.coach}</dd>
                    </div>
                  </dl>

                  <Link
                    href={`/contact?inquiry=classes&class=${item.id}#inquiry`}
                    className="mt-6 inline-flex min-h-12 items-center justify-between border border-white/15 px-5 font-display text-[0.75rem] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-brand hover:bg-brand hover:text-ink-950"
                  >
                    Book / Inquire
                    <ArrowUpRight size={16} aria-hidden />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10">
          <p className="border-l-2 border-brand pl-4 text-sm text-zinc-400">{classesNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
