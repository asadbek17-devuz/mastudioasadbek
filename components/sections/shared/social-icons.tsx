import type { ReactElement, SVGProps } from "react";
import type { SocialKey } from "@/lib/data";

export type SocialIconProps = SVGProps<SVGSVGElement>;
type IconProps = SocialIconProps;

/*
 * lucide-react 1.x ships no brand icons, so these are small inline brand SVGs
 * (24x24, currentColor) sized and colored like lucide icons via className.
 */

export function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.2 1.5h9.6a5.7 5.7 0 0 1 5.7 5.7v9.6a5.7 5.7 0 0 1-5.7 5.7H7.2a5.7 5.7 0 0 1-5.7-5.7V7.2a5.7 5.7 0 0 1 5.7-5.7Zm0 2.1a3.6 3.6 0 0 0-3.6 3.6v9.6a3.6 3.6 0 0 0 3.6 3.6h9.6a3.6 3.6 0 0 0 3.6-3.6V7.2a3.6 3.6 0 0 0-3.6-3.6H7.2ZM12 6.9a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Zm0 2.1a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.4-3.75a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7Z"
      />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0a12 12 0 1 1 0 24 12 12 0 0 1 0-24Zm4.93 8.58-1.69 7.95c-.12.56-.46.7-.93.44l-2.57-1.89-1.24 1.2c-.14.14-.25.25-.52.25l.19-2.62 4.76-4.3c.21-.18-.05-.29-.32-.1L8.73 13.2l-2.54-.79c-.55-.17-.56-.55.11-.82l9.91-3.82c.46-.17.86.11.71.81Z"
      />
    </svg>
  );
}

/** Brand glyph for each social network, shared by hero, contact and footer. */
export const socialIcons: Record<SocialKey, (props: IconProps) => ReactElement> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  telegram: TelegramIcon,
  instagram: InstagramIcon,
};

export const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Props for an anchor that opens external links in a new tab. */
export const linkTarget = (href: string) =>
  isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
