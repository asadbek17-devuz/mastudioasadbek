"use client";

import { BackToTop } from "@/components/sections/footer-parts/back-to-top";
import { ArrowSwap } from "@/components/sections/shared/hover";
import { LetterReveal } from "@/components/sections/shared/scroll-fx";
import { linkTarget, socialIcons } from "@/components/sections/shared/social-icons";
import { useData, useLocale, useT } from "@/lib/i18n";

/** Footer links: 44px tall on touch screens, color shift + icon nudge on hover. */
const linkClass =
  "group inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-cream-50/75 transition-colors duration-200 ease-ios hover:text-cream-50 focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none lg:min-h-8";

export function Footer() {
  const year = new Date().getFullYear();
  const t = useT().footer;
  const { locale } = useLocale();
  const { navItems, profile } = useData();

  // Clearing the fixed bottom tab bar on phones is the header's job: it adds
  // `body { padding-bottom: calc(88px + env(safe-area-inset-bottom)) }` below
  // 768px. The footer only keeps a small gap of its own, so the two don't add up.
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
      <div className="relative overflow-hidden rounded-card bg-ink p-5 text-cream-50 shadow-lift sm:p-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-6">
            {/* GSAP: letters tighten, rise and fade in as the footer scrolls in. Keyed by
                locale: the tween holds the letter nodes ("Asadbek" / "Асадбек"). */}
            <LetterReveal
              key={locale}
              text={profile.name}
              suffix={<span className="text-sage">.</span>}
              className="font-heading text-[clamp(3rem,15vw,6rem)] leading-[0.95] font-semibold tracking-tighter"
            />
            <p className="mt-4 max-w-sm leading-relaxed text-pretty text-cream-50/70">
              {t.tagline}
            </p>
          </div>

          <nav aria-label={t.navAria} className="lg:col-span-3">
            <h2 className="text-[13px] font-medium tracking-[0.16em] text-cream-50/60 uppercase">
              {t.navigate}
            </h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 min-[440px]:grid-cols-3 sm:grid-cols-2 lg:mt-4 lg:grid-cols-1 lg:gap-y-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <a href={`#${id}`} className={linkClass}>
                    <Icon
                      className="size-4 text-sage transition-transform duration-300 ease-ios group-hover:-translate-y-px"
                      aria-hidden="true"
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-[13px] font-medium tracking-[0.16em] text-cream-50/60 uppercase">
              {t.elsewhere}
            </h2>
            {/* Phones: a row of round 44px icon buttons (the names stay for screen
                readers). From 640px up: the labelled list. */}
            <ul className="mt-3 flex flex-wrap gap-2.5 sm:mt-2 sm:grid sm:grid-cols-2 sm:gap-x-3 sm:gap-y-0 lg:mt-4 lg:grid-cols-1 lg:gap-y-1">
              {profile.socials.map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      {...linkTarget(s.href)}
                      className={`${linkClass} max-sm:size-11 max-sm:justify-center max-sm:rounded-full max-sm:border max-sm:border-cream-50/15 max-sm:bg-cream-50/5 max-sm:active:bg-cream-50/10`}
                    >
                      <Icon
                        className="size-[18px] text-sage transition-transform duration-300 ease-ios group-hover:-translate-y-px sm:size-4"
                        aria-hidden="true"
                      />
                      <span className="max-sm:sr-only">{s.label}</span>
                      <ArrowSwap className="size-3.5 text-cream-50/40 transition-colors duration-200 group-hover:text-sage max-sm:hidden" />
                    </a>
                  </li>
                );
              })}
              <li className="w-full min-w-0 sm:col-span-2 lg:col-span-1">
                <a href={`mailto:${profile.email}`} className={`${linkClass} break-all`}>
                  {profile.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-cream-50/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cream-50/60">
            © {year} {profile.name}. {t.rights}
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
