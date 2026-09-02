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
    const closeOnResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[var(--brand-background)]/88 backdrop-blur-xl shadow-2xl shadow-black/15 border-b border-white/5'
            : 'bg-transparent'
        )}
      >
        <nav
          className={cn(
            'container-base flex items-center justify-between transition-all duration-500',
            scrolled ? 'py-3 md:py-3.5' : 'py-5 md:py-6'
          )}
        >
          <a href="#" className="flex items-center gap-3 group">
            {client.logo ? (
              <img src={client.logo} alt={client.businessName} className={cn('w-auto transition-all duration-500', scrolled ? 'h-8' : 'h-9')} />
            ) : (
              <span
                className={cn('font-bold tracking-tight transition-all duration-500', scrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl')}
                style={{ color: 'var(--brand-text)' }}
              >
                {client.businessName}
              </span>
            )}
          </a>

          <div className="hidden md:flex items-center gap-7 lg:gap-9">
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
                  <span
                    className="absolute -bottom-2 left-1/2 h-px -translate-x-1/2 transition-all duration-300"
                    style={{
                      width: active ? '100%' : '0%',
                      background: 'var(--brand-accent)',
                    }}
                  />
                </a>
              );
            })}
            {client.ctaText && client.contact && (
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: scrolled ? 'var(--brand-accent)' : 'var(--brand-text)',
                  color: scrolled ? 'var(--brand-background)' : 'var(--brand-background)',
                }}
              >
                {client.ctaText}
              </a>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-full transition-colors hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{ color: 'var(--brand-text)' }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <div
          className="absolute left-0 right-0 bottom-0 h-px origin-left transition-transform duration-150"
          style={{ background: 'var(--brand-accent)', transform: `scaleX(${Math.min(window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), 1)})` }}
        />
      </header>

      {open && (
        <div
          className="md:hidden fixed inset-x-0 top-[64px] z-40 border-t backdrop-blur-2xl shadow-2xl"
          style={{
            background: 'rgba(var(--brand-background-rgb, 10 10 15), 0.94)',
            borderColor: 'rgba(var(--brand-muted-rgb), 0.12)',
          }}
        >
          <div className="container-base flex flex-col gap-1 py-4">
            {filtered.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-base font-medium transition-colors"
                style={{ color: activeSection === link.href ? 'var(--brand-accent)' : 'var(--brand-text)' }}
              >
                {link.label}
              </a>
            ))}
            {client.ctaText && (
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-base font-semibold"
                style={{
                  background: 'var(--brand-accent)',
                  color: 'var(--brand-background)',
                }}
              >
                {client.ctaText}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
