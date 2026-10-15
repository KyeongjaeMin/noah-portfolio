import { useEffect, useRef } from 'react';
import { photoSeries, type Photo } from '../data/site';

type Props = {
  /** 넘겨볼 사진 목록 (현재 시리즈 또는 필터 결과) */
  list: Photo[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

/** 사진 크게 보기 — 좌우 화살표/스와이프로 넘기기, ESC로 닫기 */
export function Lightbox({ list, index, onClose, onChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const touchX = useRef<number | null>(null);
  const open = index != null && index >= 0 && index < list.length;

  const go = (delta: number) => {
    if (index == null) return;
    onChange((index + delta + list.length) % list.length);
  };

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    closeRef.current?.focus();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
      (lastFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!open) return null;
  const p = list[index];
  const series = photoSeries.find((s) => s.id === p.series);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${list.length}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <figure className="lightbox-figure">
        <img key={p.id} src={p.src} alt={p.alt} />
        <figcaption className="mono">
          <span>{series?.title}</span>
          <span className="tnum">
            {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
          </span>
        </figcaption>
      </figure>
      {list.length > 1 && (
        <>
          <button type="button" className="lightbox-btn lightbox-prev mono" onClick={() => go(-1)} aria-label="Previous photo">
            Prev
          </button>
          <button type="button" className="lightbox-btn lightbox-next mono" onClick={() => go(1)} aria-label="Next photo">
            Next
          </button>
        </>
      )}
      <button ref={closeRef} type="button" className="lightbox-btn lightbox-close mono" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
