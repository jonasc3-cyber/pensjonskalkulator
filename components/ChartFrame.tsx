"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const CHART_HEIGHT = 288;

/**
 * Hardens Recharts ResponsiveContainer against intermittent 0×0 sizing
 * (flex/grid race on first paint). Measures the host with ResizeObserver and
 * only mounts children once width is non-zero; remounts if size was 0.
 */
export function ChartFrame({
  children,
  "aria-label": ariaLabel,
}: {
  children: (size: { width: number; height: number }) => ReactNode;
  "aria-label": string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const measure = () => {
      const next = Math.floor(el.getBoundingClientRect().width);
      setWidth((prev) => (prev === next ? prev : next));
    };

    measure();
    // Retry after layout/paint — catches flex/grid races where first measure is 0
    const raf = requestAnimationFrame(measure);
    const t1 = window.setTimeout(measure, 50);
    const t2 = window.setTimeout(measure, 200);

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="h-72 w-full min-w-0"
      style={{ minHeight: CHART_HEIGHT, height: CHART_HEIGHT }}
      role="img"
      aria-label={ariaLabel}
    >
      {width > 0 ? children({ width, height: CHART_HEIGHT }) : null}
    </div>
  );
}

export { CHART_HEIGHT };
