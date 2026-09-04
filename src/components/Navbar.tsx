import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { ClientConfig } from '@/types/client';
import { cn } from '@/components/ui/Section';

export default function Navbar({ client }: { client: ClientConfig }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  const filtered = links.filter((l) => {
    if (l.href === '#about' && !client.about) return false;
    if (l.href === '#services' && !client.services?.length) return false;
    if (l.href === '#gallery' && !client.galleryImages?.length) return false;
    return true;
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = filtered
      .map((link) => document.querySelector(link.href))
      .filter((section): section is Element => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [filtered.map((link) => link.href).join('|')]);

  useEffect(() => {
    const closeOnResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        className={cn('fixed left-0 right-0 top-0 z-50 transition-all duration-500', scrolled ? 'border-b border-white/5 bg-[var(--brand-background)]/88 shadow-2xl shadow-black/15 backdrop-blur-xl' : 'bg-transparent')}
      >
        <nav className={cn('container-base flex items-center justify-between transition-all duration-500', scrolled ? 'py-3 md:py-3.5' : 'py-5 md:py-6')}>
          <a href="#" onClick={() => setOpen(false)} className="group flex min-w-0 items-center gap-3">
            {client.logo ? (
              <img src={client.logo} alt={client.businessName} className={cn('h-auto w-auto max-w-[180px] object-contain object-left transition-all duration-500', scrolled ? 'max-h-8' : 'max-h-9')} />
            ) : (
              <span className={cn('max-w-[58vw] truncate font-bold tracking-tight transition-all duration-500', scrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl')} style={{ color: 'var(--brand-text)' }}>
                {client.businessName}
              </span>
            )}
          </a>

          <div className="hidden items-center gap-7 md:flex lg:gap-9">
            {filtered.map((link) => {
              const active = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="group relative text-sm font-medium tracking-wide transition-colors duration-300"
                  style={{ color: active ? 'var(--brand-text)' : 'var(--brand-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = active ? 'var(--brand-text)' : 'var(--brand-muted)')}
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-1/2 h-px -translate-x-1/2 transition-all duration-300" style={{ width: active ? '100%' : '0%', background: 'var(--brand-accent)' }} />
                </a>
              );
            })}
            {client.ctaText && client.contact && (
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ background: scrolled ? 'var(--brand-accent)' : 'var(--brand-text)', color: scrolled ? 'var(--brand-on-accent)' : 'var(--brand-background)' }}
              >
                {client.ctaText}
              </a>
            )}
          </div>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            style={{ color: 'var(--brand-text)' }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {open && (
        <>
          <button aria-label="Close menu" className="fixed inset-0 z-40 bg-black/45 md:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-3 top-[72px] z-50 overflow-hidden rounded-2xl border shadow-2xl md:hidden" style={{ background: 'rgba(var(--brand-background-rgb, 10 10 15), 0.96)', borderColor: 'rgba(var(--brand-muted-rgb), 0.14)' }}>
            <div className="container-base flex flex-col gap-1 px-3 py-3">
              {filtered.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3.5 text-base font-medium transition-colors hover:bg-white/5" style={{ color: activeSection === link.href ? 'var(--brand-accent)' : 'var(--brand-text)' }}>
                  {link.label}
                </a>
              ))}
              {client.ctaText && (
                <a href="#contact" onClick={() => setOpen(false)} className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-base font-semibold" style={{ background: 'var(--brand-accent)', color: 'var(--brand-on-accent)' }}>
                  {client.ctaText}
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
