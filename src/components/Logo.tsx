import { forwardRef } from 'react';
import { GlowStar } from './GlowStar';

type Props = { className?: string; glow?: number };

/** N☆AH 로고 — 알파벳 O 자리에 빛나는 별 */
export const Logo = forwardRef<HTMLSpanElement, Props>(function Logo({ className, glow = 0.9 }, ref) {
  return (
    <span ref={ref} className={`logo${className ? ` ${className}` : ''}`} role="img" aria-label="NOAH">
      <span className="logo-letters" aria-hidden="true">N</span>
      <GlowStar className="logo-star" glow={glow} />
      <span className="logo-letters" aria-hidden="true">AH</span>
    </span>
  );
});
