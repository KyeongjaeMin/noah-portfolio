import { useMemo, useState } from 'react';
import { photos, photoSeries, type Photo, type SeriesId } from '../data/site';
import { SectionLabel } from './SectionLabel';

type Filter = 'all' | SeriesId;

/** 사진 벽돌 배치 + 시리즈 필터 (All / Wedding / Taipei / Tokyo) */
export function Photos({ onOpen }: { onOpen: (list: Photo[], index: number) => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const list = useMemo(() => (filter === 'all' ? photos : photos.filter((p) => p.series === filter)), [filter]);
  const current = photoSeries.find((s) => s.id === filter);

  const chips: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: photos.length },
    ...photoSeries.map((s) => ({ id: s.id as Filter, label: s.title, count: photos.filter((p) => p.series === s.id).length })),
  ];

  return (
    <section id="photos" className="section" aria-labelledby="photos-title">
      <div className="section-inner">
        <SectionLabel id="photos-title">Photos</SectionLabel>
        <div className="photo-bar">
          <div className="chips" role="group" aria-label="Filter photos by series">
            {chips.map((c) => (
              <button key={c.id} type="button" className="chip mono" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
                {c.label}
                <span className="chip-count tnum">{c.count}</span>
              </button>
            ))}
          </div>
          <p className="photo-bar-note mono">{current ? current.detail : 'Wedding, Taipei and Tokyo'}</p>
        </div>
        <div className="masonry" key={filter}>
          {list.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="masonry-item"
              onClick={() => onOpen(list, i)}
              aria-label={`Open photo: ${p.alt}`}
              style={{ aspectRatio: p.crop ?? (p.series === 'wedding' ? '4 / 3' : '3 / 2') }}
            >
              <img
                src={p.thumb}
                srcSet={`${p.thumb} 720w, ${p.src} 1600w`}
                sizes="(max-width: 700px) 50vw, 25vw"
                alt=""
                loading="lazy"
                decoding="async"
                style={{ objectPosition: p.cropPosition ?? '50% 50%' }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
