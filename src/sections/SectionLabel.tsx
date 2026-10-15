import { GlowStar } from '../components/GlowStar';

/** 섹션 이름표 — 작은 별 + 대문자 라벨 (참고 사이트의 'FEATURED WORK' 스타일) */
export function SectionLabel({ children, id }: { children: string; id?: string }) {
  return (
    <h2 className="section-label mono" id={id}>
      <GlowStar className="section-label-star" glow={0.7} />
      {children}
    </h2>
  );
}
