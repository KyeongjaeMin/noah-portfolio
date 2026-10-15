import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; rot: number };

/** 마우스를 움직이면 작은 별가루가 살짝 흩날림 (PC 마우스에서만, 동작 줄이기 설정 시 꺼짐) */
export function CursorSparkle() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let parts: P[] = [];
    let raf = 0;
    let last = performance.now();
    let lastSpawn = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const sparkle = (p: P, alpha: number) => {
      const s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#eef7ff';
      ctx.shadowColor = 'rgba(170,215,255,0.9)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fill();
      ctx.restore();
    };

    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      parts = parts.filter((p) => (p.life += dt) < p.max);
      for (const p of parts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 26 * dt;
        p.rot += dt * 1.5;
        const k = p.life / p.max;
        sparkle(p, (1 - k) * (k < 0.15 ? k / 0.15 : 1) * 0.85);
      }
      raf = parts.length ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn < 55 || parts.length > 40) return;
      lastSpawn = now;
      parts.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 18,
        vy: 6 + Math.random() * 14,
        life: 0,
        max: 0.7 + Math.random() * 0.5,
        size: 2.2 + Math.random() * 2.6,
        rot: Math.random() * Math.PI,
      });
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduced]);

  return <canvas ref={ref} className="cursor-sparkle" aria-hidden="true" />;
}
