"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";

const focusRing =
  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-accent-soft focus-visible:outline-none";

export function CopyEmail({ email }: { email: string }) {
  const t = useT().contact.copy;
  const [copied, setCopied] = useState(false);
  // Longer labels ("Nusxalash", "Копировать") would squeeze the address into an ellipsis
  // on narrow phones, so there the button is icon-only (it keeps its aria-label).
  const labelClass = t.copy.length > 6 ? "max-[400px]:sr-only" : undefined;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Older browsers / insecure origins: select-and-copy fallback.
      const input = document.createElement("textarea");
      input.value = email;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* The address never truncates: a long one wraps onto a second line, so the
          row uses a fixed radius (a full pill would bulge with two lines). */}
      <div className="flex min-w-0 items-center gap-2 rounded-[1.75rem] border border-accent/15 bg-cream-50 p-1 pl-4 shadow-soft">
        <span className="min-w-0 flex-1 py-1 text-[15px] leading-snug font-medium [overflow-wrap:anywhere] text-ink sm:text-base">
          {email}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? t.copiedAria : t.copyAria}
          className={`inline-flex h-11 shrink-0 items-center gap-1.5 rounded-pill bg-cream-100 px-3.5 text-sm font-medium text-ink transition-[background-color,scale] duration-200 ease-ios hover:bg-accent-soft active:scale-[0.97] ${focusRing}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-accent" aria-hidden="true" />
                  <span className={labelClass}>{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" aria-hidden="true" />
                  <span className={labelClass}>{t.copy}</span>
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t.copiedStatus : ""}
      </span>

      <a
        href={`mailto:${email}`}
        className={`group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-pill bg-accent px-5 py-3 text-sm min-[430px]:w-fit font-medium text-cream-50 shadow-soft transition-[background-color,scale,box-shadow] duration-300 ease-ios hover:bg-ink hover:shadow-lift active:scale-[0.97] ${focusRing}`}
      >
        <Mail className="size-4" aria-hidden="true" />
        {t.emailDirect}
      </a>
    </div>
  );
}

export default CopyEmail;
