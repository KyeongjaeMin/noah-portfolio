import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Intro } from './components/Intro';
import { StarField } from './components/StarField';
import { CursorSparkle } from './components/CursorSparkle';
import { Lightbox } from './components/Lightbox';
import { Player } from './components/Player';
import { Hero } from './sections/Hero';
import { Films } from './sections/Films';
import { Social } from './sections/Social';
import { Services } from './sections/Services';
import { Photos } from './sections/Photos';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { photosOf, type Opener, type Photo } from './data/site';

type Stage = 'intro' | 'reveal' | 'ready';

function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  // 주소 끝에 #films 처럼 특정 섹션으로 바로 들어온 경우엔 인트로 생략
  return Boolean(window.location.hash && window.location.hash !== '#top');
}

export default function App() {
  const [stage, setStage] = useState<Stage>(() => (shouldSkipIntro() ? 'ready' : 'intro'));
  const [film, setFilm] = useState<string | null>(null);
  const [gallery, setGallery] = useState<{ list: Photo[]; index: number } | null>(null);
  const headerLogoRef = useRef<HTMLSpanElement>(null);

  // 인트로 동안 스크롤 잠금
  useEffect(() => {
    const root = document.documentElement;
    if (stage === 'intro') {
      root.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else if (root.style.overflow === 'hidden') {
      root.style.overflow = '';
    }
  }, [stage]);

  // #films 같은 주소로 들어오면, 화면이 그려진 뒤 그 위치로 이동
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id || id === 'top') return;
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }), 60);
    return () => window.clearTimeout(t);
  }, []);

  const onReveal = useCallback(() => setStage((s) => (s === 'intro' ? 'reveal' : s)), []);
  const onDone = useCallback(() => setStage('ready'), []);

  const playFilm = useCallback((id: string) => setFilm(id), []);
  const openPhotos = useCallback((list: Photo[], index: number) => setGallery({ list, index }), []);

  /** 회전 부채·은하수에서 누른 카드/별 열기: 영상이면 플레이어, 사진이면 그 시리즈 안에서 크게 보기 */
  const open = useCallback((o: Opener) => {
    if (o.type === 'film') return setFilm(o.id);
    const list = photosOf(o.series);
    setGallery({ list, index: Math.max(0, list.findIndex((p) => p.id === o.id)) });
  }, []);

  const closeFilm = useCallback(() => setFilm(null), []);

  return (
    <>
      <StarField />
      <CursorSparkle />
      <Header logoRef={headerLogoRef} logoVisible={stage === 'ready'} revealed={stage !== 'intro'} />
      <main>
        <Hero active={stage !== 'intro'} onOpen={open} />
        <Films onPlay={playFilm} />
        <Social onPlay={playFilm} />
        <Services />
        <Photos onOpen={openPhotos} />
        <About onOpen={open} />
        <Contact />
      </main>
      <Footer />
      {stage !== 'ready' && <Intro targetRef={headerLogoRef} onReveal={onReveal} onDone={onDone} />}
      <Player filmId={film} onClose={closeFilm} onChange={setFilm} />
      <Lightbox
        list={gallery?.list ?? []}
        index={gallery?.index ?? null}
        onClose={() => setGallery(null)}
        onChange={(index) => setGallery((g) => (g ? { ...g, index } : g))}
      />
    </>
  );
}
