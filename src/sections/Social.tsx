import { useRef, useState } from 'react';
import { films, type Film } from '../data/site';
import { PreviewVideo } from '../components/PreviewVideo';
import { hasHover, useInView } from '../hooks/useInView';
import { SectionLabel } from './SectionLabel';

/** Social — 세로 숏폼 영상을 휴대폰 화면 틀 안에서 보여줌 (참고 사이트의 'MARKETING' 자리) */
export function Social({ onPlay }: { onPlay: (id: string) => void }) {
  const items = films.filter((f) => f.kind === 'social');
  return (
    <section id="social" className="section" aria-labelledby="social-title">
      <div className="section-inner">
        <SectionLabel id="social-title">Social</SectionLabel>
        <div className="social">
          <div className="social-intro">
            <p className="social-lede">
              Vertical stories, cut for <em>the scroll.</em>
            </p>
            <p className="social-sub">Short-form pieces made for phones, from a class brief for ZARA to a pork cutlet review in Busan.</p>
          </div>
          <div className="phones">
            {items.map((f) => (
              <PhoneTile key={f.id} film={f} onPlay={onPlay} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneTile({ film, onPlay }: { film: Film; onPlay: (id: string) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const inView = useInView(ref, 0.55);
  // 휴대폰 틀은 화면에 보이면 자동 재생 (PC에서도) — 마우스를 올리면 계속 재생
  const playing = inView || (hasHover() && hover);

  return (
    <button
      ref={ref}
      type="button"
      className="phone-tile"
      onClick={() => onPlay(film.id)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      aria-label={`Play ${film.title}, ${film.subtitle}, ${film.duration}`}
    >
      <span className="phone">
        <span className="phone-screen">
          <PreviewVideo className="phone-video" src={film.preview} poster={film.posterSm} playing={playing} />
          <span className="phone-island" aria-hidden="true" />
          <span className="phone-sound mono" aria-hidden="true">Tap for sound</span>
        </span>
      </span>
      <span className="phone-caption">
        <span className="film-title">{film.title}</span>
        <span className="film-meta mono">
          {film.subtitle}
          <span className="tnum">{film.duration}</span>
        </span>
      </span>
    </button>
  );
}
