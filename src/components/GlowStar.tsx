import { useId, type CSSProperties } from 'react';

/**
 * 영준 님 별 — 원본 이미지를 참고해 벡터로 다시 그린 '뽀샤시한' 별.
 * 벡터라서 아무리 키워도 깨지지 않고, 테두리는 안개처럼 번지는 빛으로 처리.
 *
 * 모양: 원본 비율에 맞춘 오각별(안쪽 반지름 비율 0.45) + 살짝 둥근 꼭짓점.
 * 빛:   ① 또렷한 흰색 몸통  ② 몸통에 붙은 얇은 푸른 테두리  ③ 넓고 옅은 바깥 번짐
 */

const OUTER = 100;
const INNER = 45;

function starPoints(): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? OUTER : INNER;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r + 6).toFixed(2)}`);
  }
  return pts.join(' ');
}

const POINTS = starPoints();

type Props = {
  /** 0 = 빛 번짐 없이 선명, 1 = 기본, 1.4 = 더 몽환적으로 */
  glow?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

export function GlowStar({ glow = 1, className, style, title }: Props) {
  const raw = useId();
  const id = `star-${raw.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const g = Math.max(0, glow);

  return (
    <svg
      className={className}
      style={style}
      viewBox="-150 -150 300 300"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {g > 0 && (
        <defs>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={0.7 + g * 0.6} result="core" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={2.5 + g * 3} result="inner" />
            <feColorMatrix
              in="inner"
              type="matrix"
              values={`0 0 0 0 0.70  0 0 0 0 0.87  0 0 0 0 1  0 0 0 ${Math.min(1, 0.85 + g * 0.15)} 0`}
              result="innerTint"
            />
            <feGaussianBlur in="SourceGraphic" stdDeviation={9 + g * 11} result="outer" />
            <feColorMatrix
              in="outer"
              type="matrix"
              values={`0 0 0 0 0.60  0 0 0 0 0.78  0 0 0 0 1  0 0 0 ${0.42 * Math.min(g, 1.6)} 0`}
              result="outerTint"
            />
            <feMerge>
              <feMergeNode in="outerTint" />
              <feMergeNode in="innerTint" />
              <feMergeNode in="core" />
            </feMerge>
          </filter>
        </defs>
      )}
      <polygon
        points={POINTS}
        fill="#fbfdff"
        stroke="#fbfdff"
        strokeWidth={4}
        strokeLinejoin="round"
        filter={g > 0 ? `url(#${id})` : undefined}
      />
    </svg>
  );
}
