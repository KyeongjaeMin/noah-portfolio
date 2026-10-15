import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { GlowStar } from './GlowStar';
import { Logo } from './Logo';
import { TvStatic } from './TvStatic';

/**
 * 첫 방문 인트로 (총 약 10초, 오른쪽 아래 SKIP으로 언제든 건너뛰기)
 *
 *  ① 검은 화면에 뽀샤시한 별이 떠오름
 *  ② 별 속으로 줌인 → 하얗게 번쩍
 *  ③ 어두운 방에 아날로그 TV, 화면은 '치지직' 노이즈 (약 4초)
 *  ④ 신호가 잡히듯 화면 속에 별이 깜빡 → 브라운관 꺼지는 효과
 *  ⑤ N☆AH 로고가 페이드인
 *  ⑥ 로고가 그대로 중앙 상단(헤더 자리)으로 올라가며 홈페이지 공개
 */

type Phase = 'black' | 'star' | 'zoom' | 'tv' | 'signal' | 'off' | 'logo' | 'fly';

// [단계, 시작 시각(ms)] — 시간 조절은 여기 숫자만 바꾸면 됩니다
const TIMELINE: [Phase, number][] = [
  ['star', 350],
  ['zoom', 2000],
  ['tv', 3150],
  ['signal', 6550],
  ['off', 7150],
  ['logo', 7900],
  ['fly', 9500],
];

type Props = {
  /** 헤더에 있는 진짜 로고 — 인트로 로고가 이 자리로 날아감 */
  targetRef: RefObject<HTMLElement>;
  /** 로고가 올라가기 시작할 때 (홈 화면 움직임 시작 신호) */
  onReveal: () => void;
  /** 인트로가 완전히 끝났을 때 */
  onDone: () => void;
};

export function Intro({ targetRef, onReveal, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('black');
  const logoRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const finished = useRef(false);
  const revealed = useRef(false);

  const reveal = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    onReveal();
  }, [onReveal]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  // 타임라인 예약
  useEffect(() => {
    timers.current = TIMELINE.map(([p, at]) => window.setTimeout(() => setPhase(p), at));
    return () => timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  // ⑥ 로고 비행: 화면 중앙 → 헤더 로고 위치
  useEffect(() => {
    if (phase !== 'fly') return;
    const el = logoRef.current;
    const target = targetRef.current;
    const bg = bgRef.current;
    reveal();
    if (!el || !target || !bg) {
      finish();
      return;
    }
    const a = el.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const s = b.width / a.width;

    const fly = el.animate(
      [
        { transform: 'translate(0px, 0px) scale(1)' },
        { transform: `translate(${dx}px, ${dy}px) scale(${s})` },
      ],
      { duration: 1250, easing: 'cubic-bezier(0.76, 0, 0.18, 1)', fill: 'forwards' },
    );
    bg.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 1000,
      delay: 300,
      easing: 'ease-in-out',
      fill: 'forwards',
    });
    fly.onfinish = () => finish();
    return () => {
      fly.onfinish = null;
    };
  }, [phase, targetRef, reveal, finish]);

  // SKIP — 바로 홈으로
  const skip = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    reveal();
    const root = bgRef.current?.parentElement;
    if (root) {
      const anim = root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, fill: 'forwards' });
      anim.onfinish = () => finish();
    } else {
      finish();
    }
  };

  // ESC 키로도 건너뛰기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const showStar = phase === 'star' || phase === 'zoom';
  const showTv = phase === 'tv' || phase === 'signal' || phase === 'off';
  const showLogo = phase === 'logo' || phase === 'fly';

  return (
    <div className={`intro intro--${phase}`} aria-label="Intro" role="presentation">
      <div ref={bgRef} className="intro-bg" />

      {showStar && (
        <div className="intro-star-wrap">
          <GlowStar className="intro-star" glow={1.2} />
        </div>
      )}

      <div className="intro-flash" />

      {showTv && (
        <div className="intro-room">
          <div className="tv">
            <div className="tv-antenna" aria-hidden="true">
              <i />
              <i />
              <b />
            </div>
            <div className="tv-body">
              <div className="tv-screen-frame">
                <div className="tv-screen">
                  <div className="tv-picture">
                    <TvStatic running={phase !== 'off'} />
                    {phase === 'signal' && (
                      <div className="tv-signal">
                        <GlowStar className="tv-signal-star" glow={1} />
                      </div>
                    )}
                  </div>
                  <div className="tv-dot" />
                  <div className="tv-glass" />
                </div>
              </div>
              <div className="tv-panel" aria-hidden="true">
                <span className="tv-knob" />
                <span className="tv-knob tv-knob--small" />
                <span className="tv-grille" />
                <span className="tv-power" />
              </div>
            </div>
            <div className="tv-feet" aria-hidden="true">
              <i />
              <i />
            </div>
          </div>
        </div>
      )}

      {showLogo && (
        <div className="intro-logo-wrap">
          <Logo ref={logoRef} className="intro-logo" glow={0.9} />
        </div>
      )}

      <button type="button" className="intro-skip" onClick={skip}>
        Skip
      </button>
    </div>
  );
}
