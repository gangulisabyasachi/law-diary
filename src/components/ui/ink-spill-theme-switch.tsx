"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useChamber } from "@/context/ChamberContext";

// #region ink
// Pure geometry: a star-shaped ink blot whose rim is fractal noise plus thin
// tendrils, with droplets that land just ahead of the front and get swallowed.
// Exact 21st.dev implementation (@kedhareswer/ink-spill-theme-switch)

export type InkShape = {
  harmonics: number[][]; // [frequency, amplitude, phase, drift]
  tendrils: number[][]; // [angle, width (rad), length (x R), delay (0..1)]
  drops: number[][]; // [angle, distance (x Rend), size (x Rend), stretch]
  dip: number; // deepest the rim can fall below R, as a fraction of R
};

const TAU = Math.PI * 2;
const FREQS = [3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
const ROUGH = 0.22; // summed rim amplitude, as a fraction of R

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeInk(seed: number): InkShape {
  const r = mulberry32(seed);
  // a fractal rim: every octave keeps a fair share, so the edge reads as ink, not as a wobbly circle
  const harmonics = FREQS.map((k) => [k, (0.6 + r() * 0.8) / Math.pow(k, 0.55), r() * TAU, (r() - 0.5) * 9]);
  let sum = 0;
  for (const h of harmonics) sum += h[1];
  for (const h of harmonics) h[1] *= ROUGH / sum;
  const tendrils: number[][] = [];
  // many hairline fingers and a few long runs
  for (let i = 0; i < 70; i++) tendrils.push([r() * TAU, 0.005 + r() * 0.018, 0.015 + Math.pow(r(), 1.6) * 0.14, r() * 0.7]);
  for (let i = 0; i < 9; i++) tendrils.push([r() * TAU, 0.014 + r() * 0.03, 0.12 + r() * 0.22, r() * 0.45]);
  const drops: number[][] = [];
  for (let i = 0; i < 130; i++) drops.push([r() * TAU, 0.05 + r() * 1.0, 0.0012 + Math.pow(r(), 2.6) * 0.009, 1 + r() * 2.2]);
  return { harmonics, tendrils, drops, dip: ROUGH };
}

function wrap(a: number) {
  a = a % TAU;
  return a > Math.PI ? a - TAU : a < -Math.PI ? a + TAU : a;
}

/** Rim radius at angle `a` for a blot of nominal radius R at progress p. */
export function rimAt(ink: InkShape, a: number, R: number, p: number) {
  let n = 0;
  for (const h of ink.harmonics) n += h[1] * Math.sin(h[0] * a + h[2] + h[3] * p);
  let spike = 0;
  for (const t of ink.tendrils) {
    const grow = Math.min(1, Math.max(0, (p - t[3]) / 0.3));
    if (grow <= 0) continue;
    const d = wrap(a - t[0]) / t[1];
    if (d > 3 || d < -3) continue;
    spike += t[2] * grow * Math.exp(-d * d);
  }
  return R * (1 + n + spike);
}

/** The radius that guarantees every corner of a w x h box is inked from (ox, oy). */
export function coverRadius(ink: InkShape, ox: number, oy: number, w: number, h: number) {
  const far = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy));
  return (far / (1 - ink.dip)) * 1.02;
}

export function easeSpill(p: number) {
  const out = 1 - Math.pow(1 - p, 3);
  const smooth = p * p * (3 - 2 * p);
  return out * 0.55 + smooth * 0.45;
}

/** An SVG/CSS path for the blot plus its droplets, all wound clockwise. */
export function inkPath(ink: InkShape, ox: number, oy: number, Rend: number, p: number, steps = 1440) {
  const R = Rend * easeSpill(p);
  if (R <= 0.5) return "";
  let d = "";
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * TAU;
    const r = rimAt(ink, a, R, p);
    d += (i ? "L" : "M") + (ox + r * Math.cos(a)).toFixed(1) + " " + (oy + r * Math.sin(a)).toFixed(1);
  }
  d += "Z";
  // droplets land just ahead of the front, stretched along the direction of travel
  for (const k of ink.drops) {
    const dist = k[1] * Rend;
    const born = (R - dist * 0.8) / (dist * 0.12);
    if (born <= 0) continue;
    const ry = Math.max(0.6, k[2] * Rend * Math.min(1, born));
    const rx = ry * k[3];
    const c = Math.cos(k[0]);
    const s = Math.sin(k[0]);
    const x = ox + dist * c;
    const y = oy + dist * s;
    const rot = ((k[0] * 180) / Math.PI).toFixed(1);
    const head = (x + rx * c).toFixed(1) + " " + (y + rx * s).toFixed(1);
    const tail = (x - rx * c).toFixed(1) + " " + (y - rx * s).toFixed(1);
    const radii = rx.toFixed(1) + " " + ry.toFixed(1) + " " + rot;
    d += "M" + head + "A" + radii + " 1 1 " + tail + "A" + radii + " 1 1 " + head + "Z";
  }
  return d;
}
// #endregion

export type InkTheme = "light" | "dark";

export type InkSpillContext = {
  theme: InkTheme;
  /** Flip the theme. Pass the element the ink should spill from (usually the toggle). */
  toggle: (from?: Element | null) => void;
  spilling: boolean;
};

export type InkSpillThemeSwitchProps = {
  /** Render your page for the given theme. It is called twice while ink is spilling. */
  children: ((ctx: InkSpillContext) => ReactNode) | ReactNode;
  defaultTheme?: InkTheme;
  /** Spill length in ms. */
  duration?: number;
  height?: string | number;
  onThemeChange?: (theme: InkTheme) => void;
  onRegisterToggle?: (toggleFn: (from?: Element | null) => void) => void;
  className?: string;
  style?: CSSProperties;
};

type Spill = { to: InkTheme; x: number; y: number; w: number; h: number; seed: number };

const CSS =
  ".ist-stage{position:relative;overflow:hidden;isolation:isolate;width:100%;height:100vh;height:100svh}" +
  ".ist-layer{position:absolute;inset:0;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain}" +
  ".ist-layer[data-theme=dark]{color-scheme:dark}" +
  ".ist-layer[data-theme=light]{color-scheme:light}" +
  ".ist-top{z-index:50;pointer-events:none;will-change:clip-path}" +
  "@media (prefers-reduced-motion:reduce){.ist-top{display:none}}";

const InkContext = createContext<InkSpillContext>({
  theme: "dark",
  toggle: () => {},
  spilling: false,
});

export function useInkSpill() {
  return useContext(InkContext);
}

export default function InkSpillThemeSwitch({
  children,
  defaultTheme = "light",
  duration = 1400,
  height = "100svh",
  onThemeChange,
  onRegisterToggle,
  className,
  style,
}: InkSpillThemeSwitchProps) {
  const [theme, setTheme] = useState(defaultTheme as InkTheme);
  const [spill, setSpill] = useState<Spill | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const baseRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const live = useRef({ theme: defaultTheme as InkTheme, busy: false });
  const changed = useRef(onThemeChange);
  changed.current = onThemeChange;

  // Sync external defaultTheme updates if idle
  useEffect(() => {
    if (!live.current.busy && defaultTheme !== theme) {
      live.current.theme = defaultTheme;
      setTheme(defaultTheme);
    }
  }, [defaultTheme, theme]);

  const toggle = useCallback((from?: Element | null) => {
    const stage = stageRef.current;
    if (!stage || live.current.busy) return;
    const next: InkTheme = live.current.theme === "light" ? "dark" : "light";
    const still = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      live.current.theme = next;
      setTheme(next);
      changed.current?.(next);
      return;
    }

    // one measurement per click: where the toggle sits inside the stage
    const s = stage.getBoundingClientRect();
    let x = s.width - 48;
    let y = 40;
    if (from) {
      const b = from.getBoundingClientRect();
      x = b.left + b.width / 2 - s.left;
      y = b.top + b.height / 2 - s.top;
    }

    live.current.busy = true;

    setSpill({ to: next, x, y, w: s.width, h: s.height, seed: (Math.random() * 2 ** 31) | 0 });
  }, []);

  useEffect(() => {
    onRegisterToggle?.(toggle);
  }, [toggle, onRegisterToggle]);

  useEffect(() => {
    if (!spill) return;

    // Initialize starting clipPath directly on the topRef element without inline JSX style resets
    if (topRef.current) {
      const initialClip = "circle(0px at " + spill.x + "px " + spill.y + "px)";
      topRef.current.style.clipPath = initialClip;
      (topRef.current.style as any).webkitClipPath = initialClip;
    }

    const ink = makeInk(spill.seed);
    const Rend = coverRadius(ink, spill.x, spill.y, spill.w, spill.h);
    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const d = inkPath(ink, spill.x, spill.y, Rend, p);
      const top = topRef.current;
      const base = baseRef.current;

      if (top) {
        if (base && top.scrollTop !== base.scrollTop) top.scrollTop = base.scrollTop;
        if (base && top.scrollLeft !== base.scrollLeft) top.scrollLeft = base.scrollLeft;
        const clipVal = d ? 'path("' + d + '")' : "circle(0px)";
        top.style.clipPath = clipVal;
        (top.style as any).webkitClipPath = clipVal;
      }

      if (p < 1) {
        raf = requestAnimationFrame(frame);
        return;
      }

      // Step 1: Fully uncover top layer so the screen is solidly the new theme
      if (top) {
        top.style.clipPath = "none";
        (top.style as any).webkitClipPath = "none";
      }

      // Step 2: Update base layer theme and notify context
      live.current.theme = spill.to;
      setTheme(spill.to);
      changed.current?.(spill.to);

      // Step 3: Double RAF handoff — wait for React to render and paint base layer
      // under the solid top layer, then seamlessly unmount top layer. Zero flicker!
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          live.current.busy = false;
          setSpill(null);
        });
      });
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [spill, duration]);

  const noop = useCallback(() => {}, []);

  const renderContent = (currentTheme: InkTheme, toggleFn: (from?: Element | null) => void, isSpilling: boolean) => {
    if (typeof children === "function") {
      return children({ theme: currentTheme, toggle: toggleFn, spilling: isSpilling });
    }
    return children;
  };

  return (
    <InkContext.Provider value={{ theme, toggle, spilling: !!spill }}>
      <div
        ref={stageRef}
        className={"ist-stage" + (className ? " " + className : "")}
        data-theme={theme}
        style={{ height, ...style }}
      >
        <style>{CSS}</style>

        {/* Base Layer: Currently Active Theme Content */}
        <div
          ref={baseRef}
          className={`ist-layer ${theme === "dark" ? "dark bg-[#111111] text-[#f3eee3]" : "bg-[#f3eee3] text-[#111111]"}`}
          data-theme={theme}
        >
          <InkContext.Provider value={{ theme, toggle, spilling: !!spill }}>
            {renderContent(theme, toggle, !!spill)}
          </InkContext.Provider>
        </div>

        {/* Top Layer: Destination Theme Content Revealed Through Expanding Ink Blot Clip-Path */}
        {spill && (
          <div
            ref={topRef}
            className={`ist-layer ist-top ${spill.to === "dark" ? "dark bg-[#111111] text-[#f3eee3]" : "bg-[#f3eee3] text-[#111111]"}`}
            data-theme={spill.to}
            aria-hidden="true"
            inert
            style={{
              willChange: "clip-path",
            }}
          >
            <InkContext.Provider value={{ theme: spill.to, toggle: noop, spilling: true }}>
              {renderContent(spill.to, noop, true)}
            </InkContext.Provider>
          </div>
        )}
      </div>
    </InkContext.Provider>
  );
}

/**
 * A small sun/moon button that spills the ink from itself.
 * Exact 21st.dev implementation with optional textual label support ("Dark Mode" / "Light Mode").
 * By default, connects to useInkSpill() so the icon/label immediately transforms under the ink wavefront.
 */
function useChamberSafe() {
  try {
    return useChamber();
  } catch {
    return null;
  }
}

export function InkThemeToggle({
  theme: explicitTheme,
  toggle: explicitToggle,
  className,
  style,
  showLabel = false,
}: {
  theme?: InkTheme;
  toggle?: (from?: Element | null) => void;
  className?: string;
  style?: CSSProperties;
  showLabel?: boolean;
}) {
  const chamber = useChamberSafe();
  const ink = useInkSpill();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = explicitTheme ?? (chamber?.theme ? (chamber.theme === "light" ? "light" : "dark") : ink.theme);
  const toggle = explicitToggle ?? chamber?.toggleTheme ?? ink.toggle;
  const dark = mounted ? theme === "dark" : true;

  return (
    <button
      type="button"
      onClick={(e) => toggle(e.currentTarget)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={
        "group relative inline-flex items-center gap-2 rounded-full border border-current/25 bg-white/20 dark:bg-black/30 backdrop-blur-md p-1.5 transition-all hover:scale-105 active:scale-95 motion-reduce:transition-none cursor-pointer select-none shadow-xs " +
        (showLabel ? "px-3 py-1.5 " : "size-9 justify-center ") +
        (className ?? "")
      }
      style={style}
    >
      <span className="flex size-6 items-center justify-center rounded-full bg-current/10 transition-transform duration-500 group-hover:rotate-45">
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
          className="transition-transform duration-300"
        >
          {dark ? (
            <>
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
            </>
          ) : (
            <path d="M20 14.6A8.4 8.4 0 0 1 9.4 4a8.4 8.4 0 1 0 10.6 10.6Z" />
          )}
        </svg>
      </span>
      {showLabel && (
        <span className="text-xs font-cinzel font-bold pr-1 select-none whitespace-nowrap tracking-wider min-w-[70px] text-left">
          <span className={`inline-block transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}>
            {mounted ? (dark ? "Dark Mode" : "Light Mode") : "Mode"}
          </span>
        </span>
      )}
    </button>
  );
}
