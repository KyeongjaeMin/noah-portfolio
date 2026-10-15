import { useEffect, useState, type RefObject } from 'react';

/** 요소가 화면 안에 들어와 있는지 (threshold = 얼마나 보여야 '보인다'로 칠지) */
export function useInView(ref: RefObject<Element>, threshold = 0.5): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  return inView;
}

/** 마우스(정밀 포인터)가 있는 기기인지 — 없으면 '화면에 보일 때 재생'으로 대신함 */
export const hasHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
