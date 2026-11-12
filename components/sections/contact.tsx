"use client";

import { MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/sections/contact-parts/contact-form";
import { CopyEmail } from "@/components/sections/contact-parts/copy-email";
import { AccentWord } from "@/components/sections/shared/accent-word";
import { ArrowSwap, cardSurface, focusRing } from "@/components/sections/shared/hover";
import { WordReveal } from "@/components/sections/shared/scroll-fx";
import { linkTarget, socialIcons } from "@/components/sections/shared/social-icons";
import { Stagger } from "@/components/sections/shared/stagger";
import { useData, useLocale, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Contact() {
  const t = useT();
  const { locale } = useLocale();
  const { profile } = useData();
  const { heading } = t.contact;
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Stagger className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-12">
          {/* Left: big CTA */}
          <Reveal inherit className="flex min-w-0 lg:col-span-5 lg:row-span-2">
            <div className="relative flex w-full flex-col overflow-hidden rounded-card border border-accent/15 bg-accent-soft p-5 shadow-soft sm:p-8">
              <span className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.16em] text-accent uppercase">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {heading.eyebrow}
              </span>
              {/* GSAP fades the words up one by one as the heading scrolls in. Keyed by locale:
                  the tween holds the word nodes, so new words need a fresh mount. */}
              <WordReveal
                key={locale}
                id="contact-title"
                className="mt-4 font-heading text-[clamp(1.875rem,1.1rem+3.4vw,3rem)] leading-[1.08] font-semibold tracking-tight text-balance text-ink"
              >
                {heading.title} <AccentWord>{heading.accent}</AccentWord>
              </WordReveal>
              <p className="mt-4 leading-relaxed text-pretty text-ink-soft">
                {heading.description}
              </p>

              <div className="mt-6 sm:mt-8">
                <CopyEmail email={profile.email} />
              </div>

              <div className="mt-6 flex flex-col gap-2.5 border-t border-accent/15 pt-5 text-sm text-ink-soft sm:mt-8 lg:mt-auto">
                <span className="inline-flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
                  {profile.location} · {t.contact.remote}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right top: form */}
          <Reveal inherit className="min-w-0 lg:col-span-7">
            <div className="rounded-card border border-line bg-cream-50 p-5 shadow-soft sm:p-7">
              <h3 className="font-heading text-lg font-semibold tracking-tight text-ink sm:text-xl">{t.contact.formTitle}</h3>
              <p className="mt-1 mb-5 text-sm text-muted">{t.contact.formNote}</p>
              <ContactForm email={profile.email} />
            </div>
          </Reveal>

          {/* Right bottom: socials */}
          <Reveal inherit className="min-w-0 lg:col-span-7">
            <ul aria-label={t.contact.socialsAria} className="grid grid-cols-2 gap-3 sm:gap-5">
              {profile.socials.map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <li key={s.key} className="flex">
                    <a
                      href={s.href}
                      {...linkTarget(s.href)}
                      className={cn(
                        cardSurface,
                        "flex min-h-14 w-full min-w-0 items-center gap-2.5 p-3 transition-[translate,box-shadow,border-color,scale] hover:-translate-y-[3px] active:scale-[0.98] motion-reduce:hover:translate-y-0 sm:gap-3 sm:p-4",
                        focusRing
                      )}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cream-100 text-ink transition-colors duration-300 ease-ios group-hover:bg-ink group-hover:text-cream sm:size-10">
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium text-ink">{s.label}</span>
                        <span className="truncate text-[13px] text-muted max-[400px]:hidden">{s.handle}</span>
                      </span>
                      <ArrowSwap className="text-muted transition-colors duration-300 group-hover:text-ink max-[400px]:hidden" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </Stagger>
      </div>
    </section>
  );
}

export default Contact;
