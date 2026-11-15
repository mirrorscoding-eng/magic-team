"use client";
import { useEffect, useRef } from "react";
import type { WaveSettings } from "@/lib/types";

/**
 * Site-wide background: soft horizontal lines that keep rolling like a slow sea, and that the
 * cursor drags through like a hand in water. Each point on a line is a little spring; the cursor's
 * movement pushes nearby points and they ripple back into place. A radial glow follows the cursor.
 * Strength, visibility, speed and line spacing come from the dashboard (settings.wave).
 */

const GAP_X = 14; // px between points on a line
const RADIUS = 260; // cursor influence radius
const TENSION = 0.012;
const FRICTION = 0.93;
const MAX_OFFSET = 70;
const MAX_SPEED = 28; // px per frame the cursor can stir with
const COUPLING = 0.1;

type Pt = { x: number; y: number; ox: number; oy: number; vx: number; vy: number };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Number.isFinite(v) ? v : lo));

export function WaveField({ settings }: { settings: WaveSettings }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gapY = clamp(settings.spacing, 20, 70);
  // sliders are 0–100 with 50 as the designed look, so 50 → ×1
  const tune = useRef({ push: 1, alpha: 1, speed: 1 });
  useEffect(() => {
    tune.current = {
      push: clamp(settings.strength, 0, 100) / 50,
      alpha: clamp(settings.visibility, 10, 100) / 50,
      speed: clamp(settings.speed, 0, 100) / 50,
    };
  }, [settings.strength, settings.visibility, settings.speed]);

  useEffect(() => {
    if (!settings.enabled) return;
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let lines: Pt[][] = [];
    // smoothed cursor (sx, sy), raw target (tx, ty), smoothed velocity (vx, vy)
    const m = { tx: -9999, ty: -9999, sx: -9999, sy: -9999, vx: 0, vy: 0, on: false, glow: 0 };
    let time = 0;
    let lastScroll = window.scrollY;
    let raf = 0;
    let last = performance.now();

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lines = [];
      const rows = Math.ceil((h + 160) / gapY);
      const cols = Math.ceil((w + 120) / GAP_X);
      for (let r = 0; r <= rows; r++) {
        const row: Pt[] = [];
        for (let c = 0; c <= cols; c++) row.push({ x: c * GAP_X - 60, y: r * gapY - 80, ox: 0, oy: 0, vx: 0, vy: 0 });
        lines.push(row);
      }
    };

    const wave = (x: number, y: number, t: number, i: number) =>
      Math.sin(x * 0.0035 + t * 0.6 + i * 0.35) * 14 +
      Math.sin(x * 0.0081 - t * 0.42 + i * 0.21 + y * 0.002) * 7 +
      Math.sin(x * 0.0017 + t * 0.25 - i * 0.12) * 10;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // one gradient for every line: bright orchid at the cursor, faint lilac elsewhere
      const gx = m.on ? m.sx : w * 0.5;
      const gy = m.on ? m.sy : h * 0.35;
      const a = (v: number) => Math.min(v * tune.current.alpha, 0.9).toFixed(3);
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.75);
      g.addColorStop(0, `rgba(235, 112, 250, ${a(0.12 + 0.5 * m.glow)})`);
      g.addColorStop(0.15, `rgba(201, 167, 255, ${a(0.1 + 0.16 * m.glow)})`);
      g.addColorStop(0.5, `rgba(250, 195, 253, ${a(0.075)})`);
      g.addColorStop(1, `rgba(179, 233, 252, ${a(0.045)})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;

      for (let i = 0; i < lines.length; i++) {
        const row = lines[i];
        ctx.beginPath();
        for (let j = 0; j < row.length; j++) {
          const p = row[j];
          const x = p.x + p.ox;
          const y = p.y + wave(p.x, p.y, t, i) + p.oy;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3); // 1 = one 60fps frame
      last = now;

      // the sea rolls on its own, and scrolling stirs it a little too
      const sy = window.scrollY;
      time += dt * 0.01667 * tune.current.speed + (sy - lastScroll) * 0.0025 * Math.min(tune.current.speed, 1);
      lastScroll = sy;
      const t = time;
      const push = tune.current.push;

      // ease the cursor and measure how fast it moves
      if (m.sx < -9000) {
        // first frame after entering: start where the cursor is, without a sweep
        m.sx = m.tx;
        m.sy = m.ty;
        m.vx = m.vy = 0;
      } else {
        const px = m.sx;
        const py = m.sy;
        m.sx += (m.tx - m.sx) * 0.22 * dt;
        m.sy += (m.ty - m.sy) * 0.22 * dt;
        m.vx += (m.sx - px - m.vx) * 0.3;
        m.vy += (m.sy - py - m.vy) * 0.3;
      }
      const rawSpeed = Math.hypot(m.vx, m.vy);
      const speed = Math.min(rawSpeed, MAX_SPEED);
      const k = rawSpeed > MAX_SPEED ? MAX_SPEED / rawSpeed : 1;
      const mvx = m.vx * k;
      const mvy = m.vy * k;
      m.glow += ((m.on ? 0.55 + Math.min(speed / 25, 0.45) : 0) - m.glow) * 0.06 * dt;

      for (let i = 0; i < lines.length; i++) {
        const row = lines[i];
        for (let j = 0; j < row.length; j++) {
          const p = row[j];
          if (m.on && speed > 0.1 && push > 0) {
            const dx = p.x + p.ox - m.sx;
            const dy = p.y + p.oy - m.sy;
            const d = Math.hypot(dx, dy);
            if (d < RADIUS) {
              const f = (1 - d / RADIUS) ** 2;
              // drag along with the cursor, plus a small push away from it
              p.vx += (mvx * 0.22 + (dx / (d || 1)) * speed * 0.06) * f * push * dt;
              p.vy += (mvy * 0.22 + (dy / (d || 1)) * speed * 0.06) * f * push * dt;
            }
          }
          // neighbours pull on each other, so a push travels along the line as a ripple
          const a = row[j - 1] ?? p;
          const b = row[j + 1] ?? p;
          p.vx += ((a.ox + b.ox) * 0.5 - p.ox) * COUPLING * dt;
          p.vy += ((a.oy + b.oy) * 0.5 - p.oy) * COUPLING * dt;
          p.vx += -p.ox * TENSION * dt;
          p.vy += -p.oy * TENSION * dt;
          p.vx *= FRICTION;
          p.vy *= FRICTION;
          p.ox = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, p.ox + p.vx * dt));
          p.oy = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, p.oy + p.vy * dt));
        }
      }

      draw(t);
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      m.tx = e.clientX;
      m.ty = e.clientY;
      m.on = true;
    };
    const onLeave = () => {
      m.on = false;
      m.sx = m.sy = -9999;
    };
    const onResize = () => {
      build();
      if (reduced) draw(0);
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    build();
    window.addEventListener("resize", onResize);
    if (reduced) {
      draw(0);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [settings.enabled, gapY]);

  if (!settings.enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1, pointerEvents: "none" }}
    />
  );
}
