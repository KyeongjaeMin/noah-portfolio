import { useEffect, useRef } from 'react';

/** 아날로그 TV '치지직' 화면 — 매 프레임 무작위 흑백 점을 찍어 만드는 노이즈 */
export function TvStatic({ running }: { running: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const W = 240;
    const H = 180;
    canvas.width = W;
    canvas.height = H;
    const img = ctx.createImageData(W, H);
    const buf = new Uint32Array(img.data.buffer);
    let raf = 0;
    let last = 0;
    let roll = 0;

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (t - last < 40) return; // 약 25fps — 옛날 TV 느낌
      last = t;
      roll = (roll + 7) % H;
      for (let y = 0; y < H; y++) {
        // 화면을 천천히 타고 내려가는 밝은 띠
        const band = Math.abs(y - roll) < 14 ? 38 : 0;
        const lineJitter = Math.random() < 0.04 ? 60 : 0;
        for (let x = 0; x < W; x++) {
          const v = Math.min(255, ((Math.random() * 255) | 0) * 0.85 + band + lineJitter) | 0;
          // 살짝 푸른 기가 도는 흑백 (little-endian ABGR)
          buf[y * W + x] = (255 << 24) | (Math.min(255, v + 8) << 16) | (v << 8) | Math.max(0, v - 4);
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    // 첫 프레임은 바로 그려서 빈 화면이 안 보이게
    frame(performance.now() + 100);
    if (!running) cancelAnimationFrame(raf);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return <canvas ref={ref} className="tv-static" aria-hidden="true" />;
}
