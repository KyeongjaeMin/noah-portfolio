import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Props = {
  src: string;
  poster: string;
  /** true일 때만 재생 (마우스를 올렸거나 화면에 보일 때) */
  playing: boolean;
  className?: string;
};

/**
 * 썸네일 자리에서 소리 없이 반복 재생되는 6초짜리 미리보기.
 * 실제 영상 파일(수 MB)은 클릭했을 때만 불러오고, 평소엔 100~400KB짜리 미리보기만 씀.
 */
export function PreviewVideo({ src, poster, playing, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const active = playing && !reduced;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      if (v.preload !== 'auto') v.preload = 'auto';
      v.play().catch(() => {
        /* 자동재생이 막힌 환경이면 포스터 이미지만 보임 */
      });
    } else {
      v.pause();
    }
  }, [active]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      data-playing={active || undefined}
    />
  );
}
