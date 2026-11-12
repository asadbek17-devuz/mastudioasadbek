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

/** Standard tween for opacity/color reveals. */
export const tween: Transition = { duration: 0.6, ease };

/** Premium reveal: fade in, rise 16px and un-blur (6px -> 0). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

/** Plain fade (used as the reduced-motion fallback). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  // Also reset y/blur: SSR may render with fadeUp's hidden state before
  // useReducedMotion resolves, and those styles must not stick.
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease } },
};

/** Subtle scale-in for cards/images. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
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
