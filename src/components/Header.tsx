import { useEffect, useState, type RefObject } from 'react';
import { Logo } from './Logo';
import { site } from '../data/site';
import { useClock } from '../hooks/useClock';

type Props = {
  logoRef: RefObject<HTMLSpanElement>;
  /** 인트로 로고가 도착하기 전엔 헤더 로고를 숨김 */
  logoVisible: boolean;
  /** 메뉴·시계가 나타나는 타이밍 */
  revealed: boolean;
};

const NAV = [
  { href: '#films', label: 'Films' },
  { href: '#social', label: 'Social' },
  { href: '#photos', label: 'Photos' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export function Header({ logoRef, logoVisible, revealed }: Props) {
  const time = useClock(site.timeZone);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${revealed ? ' is-revealed' : ''}`}>
      <div className="header-inner">
        <nav className="header-nav" aria-label="Main">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="mono-link">
              {n.label}
            </a>
          ))}
        </nav>

        <a href="#top" className="header-logo" aria-label="NOAH, back to top" style={{ opacity: logoVisible ? 1 : 0 }}>
          <Logo ref={logoRef} />
        </a>

        <p className="header-meta mono">
          <span className="header-meta-dot" aria-hidden="true" />
          Based in {site.basedIn}
          <time className="header-time">{time}</time>
        </p>

        <button
          type="button"
          className="menu-toggle mono"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? ' is-open' : ''}`} hidden={!menuOpen}>
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>
            {n.label}
          </a>
        ))}
        <p className="mono mobile-menu-meta">
          Based in {site.basedIn} · {time}
        </p>
      </div>
    </header>
  );
}
