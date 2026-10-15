import { GlowStar } from '../components/GlowStar';
import { site } from '../data/site';
import { SectionLabel } from './SectionLabel';

/** 참고 사이트의 'COVERAGE FOR(협업사 로고)' 자리 → 지금은 '작업 분야' 흐르는 띠. 협업사가 생기면 로고로 교체 */
export function Services() {
  const row = (hidden: boolean) => (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {site.services.map((s) => (
        <span key={s} className="marquee-item">
          {s}
          <GlowStar className="marquee-star" glow={0.9} />
        </span>
      ))}
    </div>
  );

  return (
    <section className="section section--tight" aria-labelledby="services-title">
      <div className="section-inner">
        <SectionLabel id="services-title">What I Make</SectionLabel>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
