import type { Transition, Variants } from "framer-motion";

/** iOS-like cubic-bezier easing (also available in CSS as `ease-ios`). */
export const ease = [0.22, 1, 0.36, 1] as const;

/** Default snappy spring (buttons, nav pill, layout changes). */
export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

/** Softer, slower spring (cards, images, larger surfaces). */
export const softSpring: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 24,
  mass: 1,
};

/** Reveal: fade in and rise 16px. Opacity + transform only, so it stays on the compositor. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** Plain fade (used as the reduced-motion fallback). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  // Also reset x/y: the server and the hydration render use an offset hidden state (the
  // reduced-motion preference is only known after hydration), and that offset must not
  // stick. It is dropped at once, while the element is still transparent, so nothing slides.
  show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4, ease, x: { duration: 0 }, y: { duration: 0 } } },
};

/** Container variants that stagger children using `hidden` / `show`. */
export function stagger(staggerChildren = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
  };
}

/** Viewport config for whileInView reveals. */
export const reveal = { once: true, margin: "-80px" } as const;

/** Card hover/press: spring lift by 3px, slight press-in. Pair with `hover:shadow-lift`. */
export const cardHover = { y: -3 } as const;
export const cardTap = { scale: 0.98 } as const;
