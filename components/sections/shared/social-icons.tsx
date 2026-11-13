export const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Props for an anchor that opens external links in a new tab. */
export const linkTarget = (href: string) =>
  isExternal(href) ? { target: "_blank", rel: "noopener" } : {};
