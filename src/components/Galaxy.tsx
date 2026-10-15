import { useEffect, useRef, useState } from 'react';
import { filmById, galaxyStars, photos, type Opener } from '../data/site';
import { GlowStar } from './GlowStar';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * 영준 님의 은하수 — 소개글 마지막 문장을 그림으로 옮긴 것.
 * "Like stars scattered across the universe, I hope each piece of my work
 *  will one day come together to form a galaxy of its own."
 *
 * - 이름이 붙은 별 하나 = 작업 하나 (영상 6편 + 사진 시리즈 3개)
 * - 뒤의 별가루는 천천히 소용돌이치며 돌아감 (캔버스)
 * - 별에 마우스를 올리면 썸네일이 뜨고, 누르면 그 작업이 열림
 * - 작업이 늘면 data/site.ts 의 galaxyStars 에 한 줄 추가 → 별이 하나 늘어남
 */
export function Galaxy({ onOpen }: { onOpen: (o: Opener) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !wrap || !ctx) return;

    // 나선팔 2개를 가진 은하 모양으로 별가루 배치 (매번 같은 모양이 나오게 고정 난수)
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
    type Dust = { r: number; a: number; size: number; alpha: number; tint: number };
    const dust: Dust[] = [];
    for (let i = 0; i < 1100; i++) {
      const arm = i % 2;
      const r = Math.pow(rand(), 0.75);
      const a = arm * Math.PI + r * 4.4 + gauss() * (0.5 - r * 0.25);
      dust.push({ r: r * 0.48 + gauss() * 0.02, a, size: rand() < 0.06 ? 1.4 : 0.5 + rand() * 0.6, alpha: 0.15 + rand() * 0.55 * (1 - r * 0.5), tint: rand() });
    }

    let size = 0;
    let raf = 0;
    let last = 0;
    let rot = 0;
    let visible = true;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = wrap.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const c = size / 2;
      // 은하 중심의 옅은 빛
      const g = ctx.createRadialGradient(c, c, 0, c, c, size * 0.42);
      g.addColorStop(0, 'rgba(207,232,255,0.20)');
      g.addColorStop(0.35, 'rgba(160,190,240,0.06)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      for (const d of dust) {
        const a = d.a + rot * (1.15 - d.r); // 안쪽이 조금 더 빨리 돎
        const x = c + Math.cos(a) * d.r * size;
        const y = c + Math.sin(a) * d.r * size * 0.62; // 비스듬히 누운 원반
        ctx.globalAlpha = d.alpha;
        ctx.fillStyle = d.tint > 0.85 ? '#ffe9c9' : '#dceeff';
        ctx.beginPath();
        ctx.arc(x, y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || t - last < 40) return;
      rot += ((t - last) / 1000) * 0.035;
      last = t;
      draw();
    };

    resize();
    draw();
    if (!reduced) raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  const thumbOf = (o: Opener) => (o.type === 'film' ? filmById(o.id)?.posterSm : photos.find((p) => p.id === o.id)?.thumb);

  return (
    <div ref={wrapRef} className="galaxy" role="group" aria-label={`My galaxy so far: ${galaxyStars.length} works`}>
      <canvas ref={canvasRef} className="galaxy-dust" aria-hidden="true" />
      {galaxyStars.map((s, i) => (
        <button
          key={s.label}
          type="button"
          className={`galaxy-star galaxy-star--${s.side ?? 'right'}${hovered === i ? ' is-hover' : ''}`}
          style={{ left: `${s.x}%`, top: `${s.y}%`, ['--s' as string]: String(s.size), ['--d' as string]: `${(i * 0.37) % 2.4}s` }}
          onClick={() => onOpen(s.open)}
          onPointerEnter={() => setHovered(i)}
          onPointerLeave={() => setHovered(null)}
          onFocus={() => setHovered(i)}
          onBlur={() => setHovered(null)}
          aria-label={`Open ${s.label}, ${s.meta}`}
        >
          <GlowStar className="galaxy-star-icon" glow={1.1} />
          <span className="galaxy-label">
            <span className="galaxy-name">{s.label}</span>
            <span className="galaxy-meta mono">{s.meta}</span>
          </span>
          <span className="galaxy-thumb" aria-hidden="true">
            <img src={thumbOf(s.open)} alt="" loading="lazy" />
          </span>
        </button>
      ))}
    </div>
  );
}
