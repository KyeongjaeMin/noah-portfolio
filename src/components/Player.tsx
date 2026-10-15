import { useEffect, useRef } from 'react';
import { films, filmById } from '../data/site';

type Props = {
  filmId: string | null;
  onClose: () => void;
  onChange: (id: string) => void;
};

/**
 * 영상 크게 보기 (소리 O, 재생바 O)
 * - 영상 비율(시네마스코프/4:3/세로)에 맞춰 틀 모양이 바뀜
 * - Wedding Film은 Part I / Part II 를 바로 오갈 수 있음
 * - ESC로 닫기, 닫으면 재생 멈춤
 */
export function Player({ filmId, onClose, onChange }: Props) {
  const film = filmId ? filmById(filmId) : undefined;
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const open = Boolean(film);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    closeRef.current?.focus();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      (lastFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  // 열리거나 Part를 바꾸면 처음부터 재생 (소리 재생이 막히면 재생 버튼을 누르면 됨)
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !film) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [film]);

  if (!film) return null;

  const siblings = film.series ? films.filter((f) => f.series === film.series) : [];
  const vertical = film.ratio < 1;

  return (
    <div
      className={`player${vertical ? ' player--vertical' : ''}`}
      style={{ ['--ratio' as string]: String(film.ratio) }}
      role="dialog"
      aria-modal="true"
      aria-label={`${film.title} ${film.subtitle}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="player-stage">
        <video
          key={film.id}
          ref={videoRef}
          className="player-video"
          src={film.src}
          poster={film.poster}
          controls
          playsInline
          preload="auto"
          controlsList="nodownload"
        />
      </div>

      <div className="player-info">
        <div className="player-titles">
          <p className="player-title">
            {film.title}
            {film.series ? <em> {film.subtitle}</em> : null}
          </p>
          <p className="mono player-meta">
            {film.series ? film.category : film.subtitle} · <span className="tnum">{film.duration}</span> · {film.credit}
          </p>
          {film.note && <p className="player-note">{film.note}</p>}
        </div>

        {siblings.length > 1 && (
          <div className="player-parts" role="group" aria-label="Parts">
            {siblings.map((s) => (
              <button
                key={s.id}
                type="button"
                className="mono player-part"
                aria-pressed={s.id === film.id}
                onClick={() => onChange(s.id)}
              >
                {s.subtitle}
              </button>
            ))}
          </div>
        )}
      </div>

      <button ref={closeRef} type="button" className="lightbox-btn lightbox-close mono" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
