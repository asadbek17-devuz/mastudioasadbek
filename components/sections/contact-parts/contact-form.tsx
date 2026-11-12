"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Check,
  LoaderCircle,
  Mail,
  MessageSquare,
  Send,
  User,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { format, useT } from "@/lib/i18n";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;
/** Which fields are invalid. The message comes from the dictionary, so it follows the language. */
type Errors = Partial<Record<Field, boolean>>;
type Status = "idle" | "sending" | "sent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** True when the value is not acceptable yet. */
function isInvalid(field: Field, value: string): boolean {
  const v = value.trim();
  if (field === "name") return v.length < 2;
  if (field === "email") return !EMAIL_RE.test(v);
  return v.length < 10;
}

const MESSAGE_MAX = 500;

/** Labels, placeholders, the hint and error messages come from `t.contact.form`. */
const fields: {
  name: Field;
  type: "text" | "email" | "textarea";
  autoComplete: string;
  icon: LucideIcon;
}[] = [
  { name: "name", type: "text", autoComplete: "name", icon: User },
  { name: "email", type: "email", autoComplete: "email", icon: Mail },
  { name: "message", type: "textarea", autoComplete: "off", icon: MessageSquare },
];

/** Soft field: cream fill that lightens on focus, accent border + wide faint ring. */
const inputBase =
  "peer w-full rounded-2xl border bg-cream pr-11 pl-11 text-[16px] text-ink placeholder:text-muted/70 transition-[border-color,box-shadow,background-color] duration-200 ease-ios focus:bg-cream-50 focus:ring-4 focus:outline-none";
const inputOk = "border-line hover:border-ink/20 focus:border-accent focus:ring-accent/10";
const inputError = "border-destructive ring-4 ring-destructive/10 focus:border-destructive focus:ring-destructive/10";

const swap = { duration: 0.2, ease } as const;

export function ContactForm({ email }: { email: string }) {
  const id = useId();
  const t = useT().contact.form;
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const refs = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>({});

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onChange = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Once a field was blurred, re-check as the user types so errors clear instantly.
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: isInvalid(field, value) }));
    if (status === "sent") setStatus("idle");
  };

  const onBlur = (field: Field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: isInvalid(field, values[field]) }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Errors = {};
    (Object.keys(values) as Field[]).forEach((f) => {
      if (isInvalid(f, values[f])) next[f] = true;
    });
    setErrors(next);
    setTouched({ name: true, email: true, message: true });

    const firstInvalid = fields.find((f) => next[f.name]);
    if (firstInvalid) {
      refs.current[firstInvalid.name]?.focus();
      return;
    }

    setStatus("sending");
    const subject = format(t.subject, { name: values.name.trim() });
    const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
    const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    timers.current.push(
      setTimeout(() => {
        window.location.href = href;
        setStatus("sent");
        timers.current.push(setTimeout(() => setStatus("idle"), 5000));
      }, 450)
    );
  };

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5" aria-describedby={`${id}-note`}>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {fields.map((f) => {
          const inputId = `${id}-${f.name}`;
          const errorId = `${inputId}-error`;
          const hintId = `${inputId}-hint`;
          const isMessage = f.type === "textarea";
          const Icon = f.icon;
          const error = touched[f.name] && errors[f.name] ? t.errors[f.name] : undefined;
          const valid = Boolean(touched[f.name]) && !isInvalid(f.name, values[f.name]);
          const describedBy = [isMessage ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
          const shared = {
            id: inputId,
            name: f.name,
            autoComplete: f.autoComplete,
            placeholder: t.placeholders[f.name],
            value: values[f.name],
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
            onBlur: () => onBlur(f.name),
            className: cn(inputBase, error ? inputError : inputOk),
          };

          return (
            <div key={f.name} className={cn("flex min-w-0 flex-col", isMessage && "sm:col-span-2")}>
              <label htmlFor={inputId} className="mb-2 text-sm font-medium text-ink-soft">
                {t.labels[f.name]}
              </label>

              <div className="group relative">
                {isMessage ? (
                  <textarea
                    {...shared}
                    ref={(el) => {
                      refs.current[f.name] = el;
                    }}
                    rows={5}
                    maxLength={MESSAGE_MAX}
                    onChange={(e) => onChange(f.name, e.target.value)}
                    className={cn(shared.className, "block min-h-36 resize-none py-3 leading-relaxed")}
                  />
                ) : (
                  <input
                    {...shared}
                    ref={(el) => {
                      refs.current[f.name] = el;
                    }}
                    type={f.type}
                    inputMode={f.type === "email" ? "email" : undefined}
                    onChange={(e) => onChange(f.name, e.target.value)}
                    className={cn(shared.className, "h-12")}
                  />
                )}
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute left-4 size-[18px] transition-colors duration-200 ease-ios",
                    isMessage ? "top-[15px]" : "top-1/2 -translate-y-1/2",
                    error ? "text-destructive" : "text-muted group-focus-within:text-accent"
                  )}
                />
                <AnimatePresence initial={false}>
                  {valid ? (
                    <motion.span
                      key="valid"
                      aria-hidden="true"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={swap}
                      className={cn(
                        "pointer-events-none absolute right-3.5 grid size-5 place-items-center rounded-full bg-accent-soft text-accent",
                        isMessage ? "top-3.5" : "top-1/2 -mt-2.5"
                      )}
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>

              {isMessage ? (
                <div className="mt-2 flex items-start justify-between gap-4 text-[13px] text-muted">
                  <span id={hintId} className="min-w-0">
                    {t.messageHint}
                  </span>
                  <span aria-hidden="true" className="shrink-0 tabular-nums">
                    {values.message.length}/{MESSAGE_MAX}
                  </span>
                </div>
              ) : null}

              <AnimatePresence initial={false}>
                {error ? (
                  <motion.p
                    key="error"
                    id={errorId}
                    initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={swap}
                    className="overflow-hidden text-[13px] leading-snug text-destructive"
                  >
                    <span className="flex items-start gap-1.5 pt-2">
                      <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                      {error}
                    </span>
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${id}-note`} className="text-[13px] text-muted">
          {t.note}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex h-12 w-full min-w-44 shrink-0 items-center justify-center rounded-pill bg-ink px-6 text-[15px] font-medium text-cream-50 shadow-soft transition-[scale,box-shadow,background-color] duration-300 ease-ios hover:bg-accent hover:shadow-lift focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 focus-visible:outline-none active:scale-[0.97] disabled:cursor-progress disabled:opacity-80 sm:w-auto"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={swap}
              className="inline-flex items-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  {t.sending}
                </>
              ) : status === "sent" ? (
                <>
                  <Check className="size-4" aria-hidden="true" />
                  {t.sent}
                </>
              ) : (
                <>
                  {t.send}
                  <Send
                    className="size-4 transition-transform duration-300 ease-ios group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "sent" ? t.sentStatus : ""}
      </span>
    </form>
  );
}

export default ContactForm;
