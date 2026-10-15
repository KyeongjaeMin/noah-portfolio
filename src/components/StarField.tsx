import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Star = { x: number; y: number; r: number; base: number; speed: number; phase: number };
type Shooting = { x: number; y: number; vx: number; vy: number; life: number; max: number } | null;

/** 화면 전체 뒤에 깔리는 은은한 밤하늘 — 별이 천천히 반짝이고, 가끔 별똥별이 지나감 */
export function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let shooting: Shooting = null;
    let nextShoot = performance.now() + 6000 + Math.random() * 8000;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(220, (w * h) / 7000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.08 ? 1.1 + Math.random() * 0.6 : 0.35 + Math.random() * 0.65,
        base: 0.18 + Math.random() * 0.45,
        speed: 0.4 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;
      for (const s of stars) {
        const a = reduced ? s.base : s.base * (0.55 + 0.45 * Math.sin(time * s.speed + s.phase));
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = '#dceeff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) {
        if (!shooting && t > nextShoot) {
          const fromLeft = Math.random() < 0.5;
          shooting = {
            x: fromLeft ? Math.random() * w * 0.4 : w * (0.6 + Math.random() * 0.4),
            y: Math.random() * h * 0.35,
            vx: (fromLeft ? 1 : -1) * (520 + Math.random() * 260),
            vy: 180 + Math.random() * 120,
            life: 0,
            max: 0.9 + Math.random() * 0.4,
          };
        }
        if (shooting) {
          const s = shooting;
          const k = 1 - s.life / s.max;
          const tail = 0.12;
          const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * tail, s.y - s.vy * tail);
          grad.addColorStop(0, `rgba(235,245,255,${0.85 * k})`);
          grad.addColorStop(1, 'rgba(235,245,255,0)');
          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * tail, s.y - s.vy * tail);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - last) / 1000);
      if (t - last < 33) return; // 약 30fps면 충분
      last = t;
      if (shooting) {
        shooting.x += shooting.vx * dt;
        shooting.y += shooting.vy * dt;
        shooting.life += dt;
        if (shooting.life > shooting.max) {
          shooting = null;
          nextShoot = t + 12000 + Math.random() * 14000;
        }
      }
      draw(t);
    };

    resize();
    draw(performance.now());
    if (!reduced) raf = requestAnimationFrame(loop);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
