import type { Metadata, Viewport } from "next";
import { Geist, Inter_Tight } from "next/font/google";
import { DotPattern } from "@/components/ui/dot-pattern";
import "./globals.css";

/*
 * `subsets` only picks which files are preloaded; next/font emits every subset with a
 * unicode-range. Cyrillic is preloaded because Russian is one of the three site
 * languages. Uzbek (Latin) needs nothing extra: oʻ / gʻ use U+02BB, part of "latin".
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/** Display face for headings (`font-heading`). Body stays Geist (`font-sans`). */
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asadbek — Software Engineer & Web Developer",
  description:
    "Asadbek is a software engineer and web developer from Tashkent, Uzbekistan, building fast, thoughtful web products and teaching the next generation of developers.",
};

export const viewport: Viewport = {
  themeColor: "#F5F0E6",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="relative isolate min-h-full bg-cream font-sans text-ink antialiased">
        {/* Site-wide dotted background: fixed behind everything (body is the stacking context). */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
          <DotPattern
            width={24}
            height={24}
            cx={1}
            cy={1}
            cr={1}
            className="fill-ink/20 md:fill-ink/20 [mask-image:radial-gradient(ellipse_120%_100%_at_50%_40%,black_55%,transparent_100%)]"
          />
        </div>
        {children}
      </body>
    </html>
  );
}
