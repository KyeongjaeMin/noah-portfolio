import { useRef, useState } from 'react';
import { filmById, type Film } from '../data/site';
import { PreviewVideo } from '../components/PreviewVideo';
import { hasHover, useInView } from '../hooks/useInView';
import { SectionLabel } from './SectionLabel';

/**
 * Films — 참고 사이트의 'FEATURED WORK' 자리.
 * 촬영 비율을 그대로 살려 배치: 시네마스코프(나고야·다큐)는 가로로 긴 띠,
 * 웨딩 필름 Part I · II 는 4:3 두 장을 나란히.
 * 마우스를 올리면(휴대폰은 화면에 보이면) 6초 미리보기가 소리 없이 재생됨.
 */
export function Films({ onPlay }: { onPlay: (id: string) => void }) {
  const nagoya = filmById('nagoya')!;
  const w1 = filmById('wedding-part-1')!;
  const w2 = filmById('wedding-part-2')!;
  const doc = filmById('discontinue')!;

  return (
    <section id="films" className="section" aria-labelledby="films-title">
      <div className="section-inner">
        <SectionLabel id="films-title">Films</SectionLabel>
        <div className="films">
          <FilmTile film={nagoya} onPlay={onPlay} shape="scope" />
          <div className="films-pair">
            <p className="films-pair-label mono">
              Wedding Film <span className="films-pair-count">— a film in two parts</span>
            </p>
            <FilmTile film={w1} onPlay={onPlay} shape="classic" />
            <FilmTile film={w2} onPlay={onPlay} shape="classic" />
          </div>
          <FilmTile film={doc} onPlay={onPlay} shape="scope" />
        </div>
      </div>
    </section>
  );
}

function FilmTile({ film, onPlay, shape }: { film: Film; onPlay: (id: string) => void; shape: 'scope' | 'classic' }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const inView = useInView(ref, 0.65);
  const playing = hasHover() ? hover : inView;
  const isPart = Boolean(film.series);

  return (
    <button
      ref={ref}
      type="button"
      className={`film-tile film-tile--${shape}`}
      onClick={() => onPlay(film.id)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={`Play ${film.title} ${film.subtitle}, ${film.duration}`}
    >
      <span className="film-frame">
        <img className="film-poster" src={film.posterSm} srcSet={`${film.posterSm} 720w, ${film.poster} 1600w`} sizes="(max-width: 760px) 100vw, 70vw" alt="" loading="lazy" decoding="async" />
        <PreviewVideo className="film-preview" src={film.preview} poster={film.posterSm} playing={playing} />
        <span className="film-play mono" aria-hidden="true">
          <span className="film-play-icon" />
          Play
        </span>
      </span>
      <span className="film-caption">
        <span className="film-title">
          {isPart ? <em>{film.subtitle}</em> : film.title}
        </span>
        <span className="film-meta mono">
          <span className="film-meta-text">{isPart ? film.credit : film.subtitle}</span>
          <span className="tnum">{film.duration}</span>
        </span>
      </span>
      {film.note && <span className="film-note">{film.note}</span>}
    </button>
  );
}
