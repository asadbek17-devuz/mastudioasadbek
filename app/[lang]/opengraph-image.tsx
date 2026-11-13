import { ImageResponse } from "next/og";

import { profile } from "@/lib/data";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { BRAND_DARK, BRAND_LIGHT, LOGO_BARS, LOGO_VIEW_BOX } from "@/lib/site";

export const alt = `${profile.name} — Full-stack Developer, Co-founder of MA STUDIO`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Share image: the "//" mark and the name on the dark brand background, with the role
 * line in the page's language. Russian keeps the English line: the built-in font of
 * `next/og` has no Cyrillic glyphs.
 */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const role = isLocale(lang) && lang !== "ru" ? getDictionary(lang).profile.role : profile.role;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_DARK,
          color: BRAND_LIGHT,
        }}
      >
        <svg width="220" height="200" viewBox={LOGO_VIEW_BOX}>
          {LOGO_BARS.map((points) => (
            <polygon key={points} points={points} fill={BRAND_LIGHT} />
          ))}
        </svg>
        <div style={{ marginTop: 56, fontSize: 104, fontWeight: 700, letterSpacing: 18 }}>
          {profile.name.toUpperCase()}
        </div>
        <div style={{ marginTop: 20, fontSize: 34, opacity: 0.7 }}>{role.replace(/ /g, " ")}</div>
      </div>
    ),
    size,
  );
}
