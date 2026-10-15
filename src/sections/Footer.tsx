import { Logo } from '../components/Logo';
import { site } from '../data/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo className="footer-logo" glow={0.7} />
          <span className="mono">
            © {site.year} {site.fullName} (<span lang="ko">{site.koreanName}</span>)
          </span>
        </div>
        <nav className="footer-links" aria-label="Social">
          <a href={site.instagram.url} className="mono-link" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={`mailto:${site.email}`} className="mono-link">
            Email
          </a>
          <a href="#top" className="mono-link">
            Top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
