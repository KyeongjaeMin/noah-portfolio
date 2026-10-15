import { Galaxy } from '../components/Galaxy';
import { films, galaxyStars, photoSeries, site, statement, type Opener } from '../data/site';
import { SectionLabel } from './SectionLabel';

/** 소개 — 왼쪽: 작업들로 이루어진 은하수 / 오른쪽: 영준 님 소개글 원문 */
export function About({ onOpen }: { onOpen: (o: Opener) => void }) {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="section-inner">
        <SectionLabel id="about-title">About</SectionLabel>
        <div className="about">
          <figure className="about-galaxy">
            <Galaxy onOpen={onOpen} />
            <figcaption className="galaxy-caption">
              <span className="mono">The galaxy so far</span>
              <span className="mono tnum">
                {galaxyStars.length} works · {films.length} films · {photoSeries.length} photo series
              </span>
            </figcaption>
          </figure>

          <div className="about-text">
            <p className="about-hello">
              <em>Hello,</em> I'm {site.nickname}.
            </p>
            {statement.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <blockquote className="about-quote">{statement.galaxy}</blockquote>
            <p className="about-signoff">{statement.signoff}</p>
            <p className="about-name mono">
              {site.fullName} · <span lang="ko">{site.koreanName}</span>
            </p>
            <a href="#contact" className="btn">
              Let's work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
