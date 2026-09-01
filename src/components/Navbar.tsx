import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { ClientConfig } from '@/types/client';
import { cn } from '@/components/ui/Section';

export default function Navbar({ client }: { client: ClientConfig }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[var(--brand-background)]/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav className="container-base flex items-center justify-between py-4 md:py-5">
        <a href="#" className="flex items-center gap-3 group">
          {client.logo ? (
            <img src={client.logo} alt={client.businessName} className="h-9 w-auto" />
          ) : (
            <span
              className="text-xl md:text-2xl font-bold tracking-tight"
              style={{ color: 'var(--brand-text)' }}
            >
              {client.businessName}
            </span>
          )}
        </a>

        <div className="hidden md:flex items-center gap-8">
          {filtered.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide transition-colors duration-300 hover:opacity-100"
              style={{ color: 'var(--brand-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--brand-muted)')}
            >
              {link.label}
            </a>
          ))}
          {client.ctaText && client.contact && (
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--brand-accent)',
                color: 'var(--brand-background)',
              }}
            >
              {client.ctaText}
            </a>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ color: 'var(--brand-text)' }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div
          className="md:hidden border-t"
          style={{
            background: 'var(--brand-background)',
            borderColor: 'rgba(var(--brand-muted-rgb), 0.15)',
          }}
        >
          <div className="container-base flex flex-col gap-1 py-4">
            {filtered.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-base font-medium transition-colors"
                style={{ color: 'var(--brand-text)' }}
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
    </header>
  );
}
