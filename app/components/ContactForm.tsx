"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CircleCheck, LoaderCircle, MessageSquareText, Pencil, Phone, TriangleAlert } from "lucide-react";
import { api, ApiError } from "@/lib/api/client";
import { classes, inquiryTypes, type InquiryType } from "@/lib/content";
import { site } from "@/lib/site";
import { buttonClasses } from "./ui/Button";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  inquiry: InquiryType;
  message: string;
};

type Errors = Partial<Record<keyof FormValues, string>>;

function validate(v: FormValues): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your full name.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) errors.phone = "Please enter a valid mobile number.";
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Please enter a valid email.";
  if (v.message.trim().length < 5) errors.message = "Tell us a little about what you're looking for.";
  return errors;
}

function toSmsBody(v: FormValues) {
  const type = inquiryTypes.find((t) => t.value === v.inquiry)?.label ?? "Inquiry";
  return [
    `Hi ActiveZone! ${type} inquiry from ${v.name.trim()}.`,
    v.message.trim(),
    `Contact: ${v.phone.trim()}${v.email ? ` / ${v.email.trim()}` : ""}`,
  ].join("\n");
}

function isInquiryType(value: string | null): value is InquiryType {
  return inquiryTypes.some((t) => t.value === value);
}

/* -------------------------------------------------------------------------- */

const fieldBase =
  "mt-2 block w-full border bg-ink-950 px-4 py-3.5 text-base text-white placeholder:text-zinc-600 transition-colors focus:outline-none focus:ring-0";

function fieldClass(error?: string) {
  return `${fieldBase} ${error ? "border-red-400/70 focus:border-red-400" : "border-white/10 focus:border-brand"}`;
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-zinc-400">
      {children}
      {optional && <span className="ml-2 normal-case tracking-normal text-zinc-600">(optional)</span>}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-300">
      {message}
    </p>
  );
}

function InquiryForm({ initial }: { initial: FormValues }) {
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<Errors>({});
  // "sent": saved to the ActiveZone dashboard. "offline": the API could not be reached, so offer SMS instead.
  const [submitted, setSubmitted] = useState<"sent" | "offline" | null>(null);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`inq-${first}`)?.focus();
      return;
    }
    setSending(true);
    setServerError(null);
    try {
      await api("/inquiries", {
        method: "POST",
        body: { name: values.name.trim(), phone: values.phone.trim(), email: values.email.trim(), type: values.inquiry, message: values.message.trim() },
      });
      setSubmitted("sent");
    } catch (err) {
      // Validation problems are shown on the form; anything else falls back to SMS/call.
      if (err instanceof ApiError && err.status === 400) setServerError(err.message);
      else setSubmitted("offline");
    } finally {
      setSending(false);
    }
  };

  if (submitted === "sent") {
    return (
      <div role="status" className="flex h-full flex-col justify-center border border-brand/30 bg-ink-900 p-8 md:p-12">
        <CircleCheck size={36} className="text-brand" aria-hidden />
        <h3 className="mt-5 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white">
          Thanks, {values.name.trim().split(" ")[0]}! Inquiry sent.
        </h3>
        <p className="mt-4 leading-relaxed text-zinc-300">
          The ActiveZone team will get back to you at <span className="font-semibold text-white">{values.phone.trim()}</span>.
          Need an answer sooner? Give us a call.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={site.phone.href} className={buttonClasses("outline", "lg", "flex-1")}>
            <Phone size={18} aria-hidden /> Call {site.phone.display}
          </a>
        </div>
      </div>
    );
  }

  if (submitted === "offline") {
    const smsHref = `${site.phone.sms}?&body=${encodeURIComponent(toSmsBody(values))}`;
    return (
      <div role="status" className="flex h-full flex-col justify-center border border-brand/30 bg-ink-900 p-8 md:p-12">
        <p className="font-display text-[0.72rem] font-bold uppercase tracking-[0.28em] text-amber-200">Send by text instead</p>
        <h3 className="mt-4 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white">
          We couldn&apos;t send it online
        </h3>
        <p className="mt-5 flex gap-3 border-l-2 border-amber-300/70 pl-4 text-sm leading-relaxed text-zinc-300">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
          Our online form isn&apos;t reachable right now, so your inquiry has not been sent. Send it as a text
          message below (it&apos;s already written for you), or give us a call.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={smsHref} className={buttonClasses("primary", "lg", "flex-1")}>
            <MessageSquareText size={18} aria-hidden /> Send as Text
          </a>
          <a href={site.phone.href} className={buttonClasses("outline", "lg", "flex-1")}>
            <Phone size={18} aria-hidden /> Call {site.phone.display}
          </a>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(null)}
          className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-zinc-400 hover:text-white"
        >
          <Pencil size={14} aria-hidden /> Edit inquiry
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="border border-white/[0.07] bg-ink-900 p-6 sm:p-8 md:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="inq-name">Full Name</Label>
          <input
            id="inq-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "inq-name-error" : undefined}
            className={fieldClass(errors.name)}
            placeholder="Juan Dela Cruz"
          />
          <FieldError id="inq-name-error" message={errors.name} />
        </div>

        <div>
          <Label htmlFor="inq-phone">Phone Number</Label>
          <input
            id="inq-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "inq-phone-error" : undefined}
            className={fieldClass(errors.phone)}
            placeholder="09XX XXX XXXX"
          />
          <FieldError id="inq-phone-error" message={errors.phone} />
        </div>

        <div>
          <Label htmlFor="inq-email" optional>
            Email
          </Label>
          <input
            id="inq-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "inq-email-error" : undefined}
            className={fieldClass(errors.email)}
            placeholder="you@email.com"
          />
          <FieldError id="inq-email-error" message={errors.email} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="inq-inquiry">Inquiry Type</Label>
          <div className="relative">
            <select
              id="inq-inquiry"
              name="inquiry"
              value={values.inquiry}
              onChange={(e) => update("inquiry", e.target.value as InquiryType)}
              className={`${fieldClass()} appearance-none pr-10`}
            >
              {inquiryTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 mt-1 size-2.5 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-zinc-400"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="inq-message">Message</Label>
          <textarea
            id="inq-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "inq-message-error" : undefined}
            className={`${fieldClass(errors.message)} resize-y`}
            placeholder="Tell us your goals, preferred schedule, or any questions."
          />
          <FieldError id="inq-message-error" message={errors.message} />
        </div>
      </div>

      {serverError && (
        <p role="alert" className="mt-6 text-sm text-red-300">
          {serverError}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className={buttonClasses("primary", "lg", "mt-8 w-full disabled:opacity-70 sm:w-auto")}
      >
        {sending ? "Sending…" : "Send Inquiry"}
        {sending ? <LoaderCircle size={18} className="animate-spin" aria-hidden /> : <ArrowRight size={18} aria-hidden />}
      </button>
    </form>
  );
}

const emptyValues: FormValues = { name: "", phone: "", email: "", inquiry: "membership", message: "" };

/** Pre-fills the inquiry type (and class name) from links like /contact?inquiry=classes&class=zumba. */
function InquiryFormFromParams() {
  const params = useSearchParams();
  const inquiry = params.get("inquiry");
  const cls = classes.find((c) => c.id === params.get("class"));
  const initial: FormValues = {
    ...emptyValues,
    inquiry: isInquiryType(inquiry) ? inquiry : emptyValues.inquiry,
    message: cls ? `Hi! I'd like to ask about the ${cls.name} class schedule.` : "",
  };
  return <InquiryForm key={params.toString()} initial={initial} />;
}

export function ContactForm() {
  return (
    <Suspense fallback={<InquiryForm initial={emptyValues} />}>
      <InquiryFormFromParams />
    </Suspense>
  );
}
