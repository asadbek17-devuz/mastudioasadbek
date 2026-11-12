import type MatterNS from "matter-js";

type MatterLib = typeof MatterNS;

/*
 * Physics pile for the stack playground.
 *
 * matter-js only simulates: every pill stays a real DOM element (`[data-pill]`
 * inside the arena) and gets its `transform` written once per frame. There is
 * no canvas and no React render in the loop.
 *
 * The loop is a single requestAnimationFrame with a fixed 60 Hz step. It stops
 * by itself when the arena is offscreen or when every body has fallen asleep,
 * and is kicked awake again by any interaction.
 */

export interface Pile {
  /** Empties the arena and rains every pill in from the top again. */
  drop(): void;
  /** Random kick for every pill. */
  shake(): void;
  /** Throws the pills of one category upward, so they land on top of the pile. */
  lift(category: string): void;
  destroy(): void;
}

interface Item {
  el: HTMLElement;
  body: MatterNS.Body | null;
  w: number;
  h: number;
  /** In the world (already dropped). */
  live: boolean;
  /** Label turned 180deg because the pill lies upside down. */
  flipped: boolean;
}

const STEP = 1000 / 60;
/** Longest frame gap that is simulated; a hidden tab must not fast-forward. */
const MAX_FRAME = 50;
const WALL = 300;
/** Gap between the arena edge and the pile. */
const PAD = 10;
const MAX_SPEED = 28;
const DROP_GAP = 80;
/** Pointer travel (px) after which a press counts as a drag, not a tap. */
const TAP_SLOP = 5;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function createPile(M: MatterLib, arena: HTMLElement, onInteract: () => void): Pile {
  const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = M;

  const engine = Engine.create({ enableSleeping: true });
  const world = engine.world;

  const items: Item[] = Array.from(arena.querySelectorAll<HTMLElement>("[data-pill]"), (el) => {
    el.style.opacity = "0";
    return { el, body: null, w: 0, h: 0, live: false, flipped: false };
  });

  let width = 0;
  let height = 0;
  let walls: MatterNS.Body[] = [];

  let raf = 0;
  let last = 0;
  let acc = 0;
  let simTime = 0;
  let visible = false;
  let dropped = false;
  let destroyed = false;
  let pending: { item: Item; at: number }[] = [];
  let lane = 0;

  let drag: {
    item: Item;
    constraint: MatterNS.Constraint;
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null = null;

  /* ------------------------------ bodies ------------------------------ */

  function makeBody(item: Item, x: number, y: number) {
    return Bodies.rectangle(x, y, item.w, item.h, {
      chamfer: { radius: Math.max(item.h / 2 - 0.5, 1) },
      restitution: 0.32,
      friction: 0.45,
      frictionAir: 0.014,
      density: 0.0016,
      sleepThreshold: 45,
    });
  }

  function buildWalls() {
    if (walls.length) Composite.remove(world, walls);
    const opts = { isStatic: true, friction: 0.5, restitution: 0.2 };
    const tall = height + 4000;
    walls = [
      Bodies.rectangle(width / 2, height - PAD + WALL / 2, width + WALL * 2, WALL, opts),
      Bodies.rectangle(PAD - WALL / 2, height - tall / 2, WALL, tall, opts),
      Bodies.rectangle(width - PAD + WALL / 2, height - tall / 2, WALL, tall, opts),
    ];
    Composite.add(world, walls);
  }

  /**
   * Re-reads the arena and pill sizes (resize, breakpoint, font swap, a new
   * locale with longer labels). Walls are rebuilt, bodies whose pill changed
   * size are replaced in place and everything is clamped back inside.
   */
  function sync() {
    if (destroyed) return;
    const w = arena.clientWidth;
    const h = arena.clientHeight;
    if (!w || !h) return;

    let changed = false;
    let redrop = false;
    if (w !== width || h !== height) {
      if (width && w !== width) {
        // Keep every pill at the same relative spot. A much narrower arena
        // cannot hold the old pile shape, so it rains in again instead.
        const k = w / width;
        redrop = dropped && k < 0.85;
        for (const item of items) {
          if (item.body && item.live) {
            Body.setPosition(item.body, { x: item.body.position.x * k, y: item.body.position.y });
          }
        }
      }
      width = w;
      height = h;
      buildWalls();
      changed = true;
    }

    for (const item of items) {
      const iw = item.el.offsetWidth;
      const ih = item.el.offsetHeight;
      if (!iw || !ih) continue;
      if (item.body && iw === item.w && ih === item.h) continue;

      const old = item.body;
      item.w = iw;
      item.h = ih;
      const next = makeBody(item, old ? old.position.x : width / 2, old ? old.position.y : -ih);
      if (old) {
        Body.setAngle(next, old.angle);
        Body.setVelocity(next, old.velocity);
        if (item.live) {
          if (drag?.item === item) endDrag(false);
          Composite.remove(world, old);
          Composite.add(world, next);
        }
      }
      item.body = next;
      changed = true;
    }

    if (!changed) return;

    for (const item of items) {
      const body = item.body;
      if (!body || !item.live) continue;
      const half = Math.max(item.w, item.h) / 2;
      const x = clamp(body.position.x, PAD + half, Math.max(width - PAD - half, PAD + half));
      const y = Math.min(body.position.y, height - PAD - item.h / 2);
      if (x !== body.position.x || y !== body.position.y) Body.setPosition(body, { x, y });
      Sleeping.set(body, false);
    }
    if (redrop) drop();
    kick();
    if (!raf) render();
  }

  /* ------------------------------- loop ------------------------------- */

  function release(item: Item) {
    const body = item.body;
    if (!body) return;
    // Three lanes in turn, so two pills in a row never spawn on top of each other.
    const span = Math.max(width - PAD * 2 - item.w, 0);
    const x = PAD + item.w / 2 + span * clamp((lane % 3) / 3 + rand(0.02, 0.31), 0, 1);
    lane += 1;

    Sleeping.set(body, false);
    Body.setPosition(body, { x, y: -item.h });
    Body.setAngle(body, rand(-0.45, 0.45));
    Body.setVelocity(body, { x: rand(-1.2, 1.2), y: rand(3, 5) });
    Body.setAngularVelocity(body, rand(-0.04, 0.04));
    Composite.add(world, body);
    item.live = true;
    item.el.style.opacity = "1";
  }

  function step() {
    simTime += STEP;

    if (pending.length) {
      const rest: typeof pending = [];
      for (const p of pending) {
        if (p.at <= simTime) release(p.item);
        else rest.push(p);
      }
      pending = rest;
    }

    if (drag?.item.body) Sleeping.set(drag.item.body, false);

    Engine.update(engine, STEP);

    for (const item of items) {
      const body = item.body;
      if (!body || !item.live || body.isSleeping) continue;

      const { x: vx, y: vy } = body.velocity;
      const speed = Math.hypot(vx, vy);
      if (speed > MAX_SPEED) {
        const k = MAX_SPEED / speed;
        Body.setVelocity(body, { x: vx * k, y: vy * k });
      }
      // Thrown far above the arena: stop climbing, gravity brings it back.
      if (body.position.y < -400 && body.velocity.y < 0) {
        Body.setVelocity(body, { x: body.velocity.x, y: 0 });
      }
      // Safety net if anything ever tunnels through a wall.
      const { x, y } = body.position;
      if (y > height + 80 || x < -80 || x > width + 80) {
        Body.setPosition(body, { x: width / 2, y: -item.h });
        Body.setVelocity(body, { x: 0, y: 2 });
      }
    }
  }

  function render() {
    for (const item of items) {
      const body = item.body;
      if (!body || !item.live) continue;
      const x = Math.round((body.position.x - item.w / 2) * 10) / 10;
      const y = Math.round((body.position.y - item.h / 2) * 10) / 10;
      item.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle.toFixed(4)}rad)`;

      // Upside down: the label turns half a turn inside its (symmetric) pill,
      // so it never has to be read on its head. The dead zone stops flicker.
      const up = Math.cos(body.angle);
      if (up < -0.12 && !item.flipped) {
        item.flipped = true;
        item.el.dataset.flip = "";
      } else if (up > 0.12 && item.flipped) {
        item.flipped = false;
        delete item.el.dataset.flip;
      }
    }
  }

  function busy() {
    if (pending.length || drag) return true;
    return items.some((item) => item.live && item.body && !item.body.isSleeping);
  }

  function frame(now: number) {
    raf = 0;
    acc += Math.min(now - last, MAX_FRAME);
    last = now;
    while (acc >= STEP) {
      step();
      acc -= STEP;
    }
    render();
    if (visible && busy()) raf = requestAnimationFrame(frame);
  }

  function kick() {
    if (raf || destroyed || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  /* ----------------------------- actions ------------------------------ */

  function drop() {
    if (destroyed) return;
    sync();
    endDrag(false);
    dropped = true;
    lane = Math.floor(rand(0, 3));
    const order = [...items].sort(() => Math.random() - 0.5);
    pending = [];
    order.forEach((item, i) => {
      if (!item.body) return;
      if (item.live) Composite.remove(world, item.body);
      item.live = false;
      item.el.style.opacity = "0";
      pending.push({ item, at: simTime + 120 + i * DROP_GAP });
    });
    kick();
  }

  function fling(item: Item, vx: number, vy: number, spin: number) {
    const body = item.body;
    if (!body || !item.live) return;
    Sleeping.set(body, false);
    Body.setVelocity(body, { x: vx, y: vy });
    Body.setAngularVelocity(body, spin);
  }

  function shake() {
    for (const item of items) fling(item, rand(-9, 9), rand(-13, -6), rand(-0.18, 0.18));
    kick();
  }

  function lift(category: string) {
    for (const item of items) {
      if (item.el.dataset.cat !== category) continue;
      fling(item, rand(-1.6, 1.6), rand(-12.5, -9.5), rand(-0.05, 0.05));
    }
    kick();
  }

  function pop(item: Item) {
    fling(item, rand(-2.2, 2.2), rand(-10, -8), rand(-0.12, 0.12));
    kick();
  }

  /* ----------------------------- pointer ------------------------------ */

  /** Client coordinates to arena coordinates (the arena may be scaled by GSAP). */
  function toLocal(e: PointerEvent | MouseEvent) {
    const rect = arena.getBoundingClientRect();
    const scale = rect.width / arena.offsetWidth || 1;
    return {
      x: (e.clientX - rect.left - arena.clientLeft * scale) / scale,
      y: (e.clientY - rect.top - arena.clientTop * scale) / scale,
    };
  }

  function itemFrom(target: EventTarget | null) {
    const el = target instanceof Element ? target.closest<HTMLElement>("[data-pill]") : null;
    return el ? (items.find((item) => item.el === el) ?? null) : null;
  }

  function endDrag(allowTap: boolean) {
    if (!drag) return;
    const { item, constraint, pointerId, moved } = drag;
    drag = null;
    Composite.remove(world, constraint);
    arena.style.cursor = "";
    if (arena.hasPointerCapture(pointerId)) arena.releasePointerCapture(pointerId);
    if (allowTap && !moved) pop(item);
    kick();
  }

  // Mouse and pen only. Touch never starts a drag, so a swipe over the arena
  // keeps scrolling the page; a tap arrives as `click` below.
  function onPointerDown(e: PointerEvent) {
    if (e.pointerType === "touch" || e.button !== 0 || drag) return;
    const item = itemFrom(e.target);
    if (!item?.body || !item.live) return;
    e.preventDefault();

    const point = toLocal(e);
    const body = item.body;
    Sleeping.set(body, false);
    const constraint = Constraint.create({
      pointA: point,
      bodyB: body,
      pointB: { x: point.x - body.position.x, y: point.y - body.position.y },
      length: 0,
      stiffness: 0.16,
      damping: 0.06,
    });
    // Same trick as Matter's MouseConstraint: pointB follows the body's rotation.
    (constraint as MatterNS.Constraint & { angleB: number }).angleB = body.angle;
    Composite.add(world, constraint);

    drag = { item, constraint, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, moved: false };
    arena.setPointerCapture(e.pointerId);
    arena.style.cursor = "grabbing";
    onInteract();
    kick();
  }

  function onPointerMove(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > TAP_SLOP) {
      drag.moved = true;
    }
    const point = toLocal(e);
    const anchor = drag.constraint.pointA;
    anchor.x = clamp(point.x, PAD, width - PAD);
    anchor.y = clamp(point.y, -40, height - PAD);
  }

  function onPointerUp(e: PointerEvent) {
    if (drag && e.pointerId === drag.pointerId) endDrag(e.type === "pointerup");
  }

  let lastPointerType = "mouse";
  function onPointerType(e: PointerEvent) {
    lastPointerType = e.pointerType;
  }

  function onClick(e: MouseEvent) {
    // Mouse and pen taps are handled on pointerup (the pointer is captured).
    if (lastPointerType !== "touch") return;
    const item = itemFrom(e.target);
    if (!item) return;
    onInteract();
    pop(item);
  }

  arena.addEventListener("pointerdown", onPointerType, true);
  arena.addEventListener("pointerdown", onPointerDown);
  arena.addEventListener("pointermove", onPointerMove);
  arena.addEventListener("pointerup", onPointerUp);
  arena.addEventListener("pointercancel", onPointerUp);
  arena.addEventListener("click", onClick);

  /* ---------------------------- observers ----------------------------- */

  const resizeObserver = new ResizeObserver(() => sync());
  resizeObserver.observe(arena);
  for (const item of items) resizeObserver.observe(item.el);

  const viewObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      if (!dropped && entry.intersectionRatio >= 0.3) drop();
      else kick();
    },
    { threshold: [0, 0.3] }
  );
  viewObserver.observe(arena);

  sync();

  return {
    drop() {
      onInteract();
      drop();
    },
    shake() {
      onInteract();
      shake();
    },
    lift,
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      raf = 0;
      endDrag(false);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      arena.removeEventListener("pointerdown", onPointerType, true);
      arena.removeEventListener("pointerdown", onPointerDown);
      arena.removeEventListener("pointermove", onPointerMove);
      arena.removeEventListener("pointerup", onPointerUp);
      arena.removeEventListener("pointercancel", onPointerUp);
      arena.removeEventListener("click", onClick);
      Composite.clear(world, false);
      Engine.clear(engine);
      for (const item of items) {
        item.el.style.transform = "";
        item.el.style.opacity = "";
        delete item.el.dataset.flip;
      }
    },
  };
}
