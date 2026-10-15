import { useRef, useState } from 'react';
import { GlowStar } from '../components/GlowStar';
import { site, statement } from '../data/site';
import { SectionLabel } from './SectionLabel';

/** 작업 문의 — 영업용 마지막 섹션. 이메일은 글자로 보여주고 복사 버튼 제공 */
export function Contact() {
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLSpanElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      // 복사가 막힌 환경이면 글자를 선택해 두어 직접 복사할 수 있게
      const el = emailRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <GlowStar className="contact-star" glow={1.6} />
      <div className="section-inner">
        <SectionLabel id="contact-title">Contact</SectionLabel>
        <p className="contact-headline">
          Let's make people
          <br />
          <em>feel something.</em>
        </p>
        <p className="contact-sub">
          {statement.signoff} Weddings, travel films, documentaries or social content: tell me the idea, the date and the place.
        </p>
        <div className="contact-actions">
          <div className="email-chip">
            <a href={`mailto:${site.email}`} className="email-link">
              <span ref={emailRef}>{site.email}</span>
            </a>
            <button type="button" className="email-copy mono" onClick={copy} aria-live="polite">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <a href={site.instagram.url} className="btn btn--ghost" target="_blank" rel="noreferrer">
            Instagram {site.instagram.handle}
          </a>
        </div>
      </div>
    </section>
  );
}
