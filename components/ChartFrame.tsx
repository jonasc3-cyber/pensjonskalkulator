"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const CHART_HEIGHT = 288;

/** Calm placeholder while measuring or when there is nothing to plot. */
export function ChartPlaceholder({
  message = "Diagrammet lastes…",
}: {
  message?: string;
}) {
  return (
    <div
      className="flex h-full min-h-[280px] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 text-center"
      role="status"
      data-testid="chart-placeholder"
    >
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

/**
 * Hardens Recharts against intermittent 0×0 sizing (flex/grid first-paint race).
 * Measures host with ResizeObserver + rAF/timeout retries; only mounts the chart
 * once width is non-zero, with explicit pixel width/height.
 * Parent always has explicit min-height so layout never collapses.
 */
export function ChartFrame({
  children,
  "aria-label": ariaLabel,
  empty = false,
  emptyMessage = "Ingen data å vise ennå. Fyll inn tall i kalkulatoren for å se diagrammet.",
}: {
  children: (size: { width: number; height: number }) => ReactNode;
  "aria-label": string;
  /** When true, show empty message instead of mounting the chart. */
  empty?: boolean;
  emptyMessage?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      let next = Math.floor(rect.width);
      // Fallback if flex/grid parent briefly reports 0
      if (next <= 0) {
        next = Math.floor(el.clientWidth || el.parentElement?.clientWidth || 0);
      }
      if (next <= 0 && typeof window !== "undefined") {
        next = Math.min(640, Math.max(280, window.innerWidth - 48));
      }
      setWidth((prev) => (prev === next ? prev : next));
    };

    measure();
    const raf = requestAnimationFrame(measure);
    const t1 = window.setTimeout(measure, 50);
    const t2 = window.setTimeout(measure, 200);
    const t3 = window.setTimeout(measure, 500);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure())
        : null;
    ro?.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      ro?.disconnect();
    };
  }, []);

  return (
    <div
      className="w-full min-w-0 overflow-x-auto"
      data-testid="chart-frame"
    >
      <div
        ref={hostRef}
        className="h-72 w-full min-h-[280px] min-w-0"
        style={{ minHeight: CHART_HEIGHT, height: CHART_HEIGHT }}
        role="img"
        aria-label={ariaLabel}
      >
        {empty ? (
          <ChartPlaceholder message={emptyMessage} />
        ) : width > 0 ? (
          children({ width, height: CHART_HEIGHT })
        ) : (
          <ChartPlaceholder message="Diagrammet lastes…" />
        )}
      </div>
    </div>
  );
}
