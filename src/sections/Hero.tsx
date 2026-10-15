import { HeroFan } from '../components/HeroFan';
import { GlowStar } from '../components/GlowStar';
import { fanItems, site, type Opener } from '../data/site';

type Props = { active: boolean; onOpen: (o: Opener) => void };

export function Hero({ active, onOpen }: Props) {
  return (
    <section id="top" className={`hero${active ? ' is-active' : ''}`} aria-label="Intro">
      <div className="hero-side hero-side--left">
        <p className="mono">{site.roles}</p>
        <p className="mono hero-school">{site.school}</p>
        <p className="hero-tagline">{site.tagline}</p>
      </div>

      <HeroFan items={fanItems} active={active} onOpen={onOpen} />

      <nav className="hero-side hero-side--right" aria-label="Sections">
        <a href="#films" className="mono-link">Films</a>
        <a href="#social" className="mono-link">Social</a>
        <a href="#photos" className="mono-link">Photos</a>
      </nav>

      <p className="hero-badge mono">
        <GlowStar className="hero-badge-star" glow={0.8} />
        Open to collaborations
      </p>

      <a href="#films" className="hero-scroll mono" aria-label="Scroll to films">
        <span className="hero-scroll-arrow" aria-hidden="true">↓</span>
        Scroll
      </a>
    </section>
  );
}
