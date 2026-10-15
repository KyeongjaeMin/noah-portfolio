import { useEffect, useRef } from 'react';
import type { FanItem, Opener } from '../data/site';
import { GlowStar } from './GlowStar';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * 메인 화면 가운데의 회전하는 사진 부채 (참고 사이트의 '빙글빙글 원형' 효과)
 *
 * 원리: 사진 카드들의 왼쪽 끝을 가운데 세로축(책등)에 꽂고, 360°로 고르게 펼침.
 *       전체를 계속 돌리면서(Y축) 앞뒤 기울기(X축)를 천천히 바꾸면
 *       '책 펼친 모양' ↔ '별이 터지는 모양'을 오가며 돌아감.
 *       가운데엔 영준 님 별이 은은하게 빛남.
 *
 * 조작: 마우스/손가락으로 좌우로 끌면 돌릴 수 있고, 카드를 누르면 영상 재생 / 사진 크게 보기.
 * 카드 20장 = 영상 썸네일 6 + 사진 14 (목록은 data/site.ts 의 fanItems)
 */

type Props = {
  items: FanItem[];
  /** 인트로가 끝나면 true → 카드가 펼쳐지며 회전 시작 */
  active: boolean;
  onOpen: (open: Opener) => void;
};

const SPIN_SPEED = 11; // 초당 회전 각도
const TILT_PERIOD = 16; // 기울기 한 바퀴(책↔별) 걸리는 초
const TILT_MAX = 72;

export function HeroFan({ items, active, onOpen }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();

  const cards = items;
  const step = 360 / cards.length;

  useEffect(() => {
    const stage = stageRef.current;
    const fan = fanRef.current;
    if (!stage || !fan) return;

    let raf = 0;
    let last = performance.now();
    let angle = -30;
    let time = TILT_PERIOD * 0.58; // 처음엔 별 모양에 가까운 기울기에서 시작
    let open = 0;
    let velocity = 0;
    let dragging = false;
    let dragMoved = 0;
    let dragX = 0;
    let hover = false;
    let visible = true;

    const applyCards = () => {
      const eased = 1 - Math.pow(1 - open, 3);
      cardRefs.current.forEach((c, i) => {
        if (c) c.style.transform = `rotateY(${i * step * eased}deg)`;
      });
    };

    const render = () => {
      const tilt = reduced ? 24 : (TILT_MAX / 2) * (1 - Math.cos((time / TILT_PERIOD) * Math.PI * 2));
      fan.style.transform = `rotateX(${tilt.toFixed(2)}deg) rotateY(${angle.toFixed(2)}deg)`;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (!active || !visible) return;

      if (open < 1) {
        open = Math.min(1, open + dt / 1.6);
        applyCards();
      }
      if (!dragging) {
        if (!reduced) {
          const target = hover ? SPIN_SPEED * 0.25 : SPIN_SPEED;
          velocity += (target - velocity) * Math.min(1, dt * 2.2);
          time += dt * (hover ? 0.3 : 1);
        } else {
          velocity *= 0.92;
        }
        angle += velocity * dt;
      }
      render();
    };

    applyCards();
    render();
    raf = requestAnimationFrame(loop);

    // 끌어서 돌리기
    const onDown = (e: PointerEvent) => {
      dragging = true;
      dragMoved = 0;
      dragX = e.clientX;
      velocity = 0;
      stage.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragX;
      dragX = e.clientX;
      dragMoved += Math.abs(dx);
      angle += dx * 0.35;
      velocity = dx * 0.35 * 60;
      render();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage.releasePointerCapture?.(e.pointerId);
      // 거의 안 움직였으면 '클릭'으로 보고 그 사진 열기
      if (dragMoved < 6) {
        const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-card]');
        const item = el ? cards[Number(el.dataset.card)] : undefined;
        if (item) onOpen(item.open);
      }
    };
    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    fan.addEventListener('pointerenter', onEnter);
    fan.addEventListener('pointerleave', onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(stage);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
      fan.removeEventListener('pointerenter', onEnter);
      fan.removeEventListener('pointerleave', onLeave);
    };
  }, [active, reduced, step, onOpen, cards]);

  return (
    <div ref={stageRef} className="fan-stage" aria-label="Rotating gallery of films and photos. Drag to spin, press a card to open it.">
      <GlowStar className="fan-core" glow={1.5} />
      <div ref={fanRef} className="fan">
        {cards.map((w, i) => (
          <button
            key={w.key}
            type="button"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={`fan-card${w.open.type === 'film' ? ' fan-card--film' : ''}`}
            data-card={i}
            aria-label={`${w.open.type === 'film' ? 'Play film' : 'Open photo'}: ${w.alt}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen(w.open);
              }
            }}
          >
            <img src={w.thumb} alt="" draggable={false} loading="eager" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}
