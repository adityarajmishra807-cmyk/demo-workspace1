import type { ClientConfig } from '@/types/client';
import { Container } from '@/components/ui/Section';
import { Phone, Mail, Instagram, Globe, MapPin } from 'lucide-react';

export default function Footer({ client }: { client: ClientConfig }) {
  const c = client.contact;
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-12 md:py-16 border-t"
      style={{
        background: 'var(--brand-surface)',
        borderColor: 'rgba(var(--brand-surface-muted-rgb), 0.18)',
      }}
    >
      <Container>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10">
          <div>
            {client.logo ? (
              <img src={client.logo} alt={client.businessName} className="h-8 w-auto mb-4" />
            ) : (
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--brand-surface-text)' }}>
                {client.businessName}
              </h3>
            )}
            {client.tagline && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-surface-muted)' }}>
                {client.tagline}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--brand-accent)' }}>Navigation</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'About', href: '#about', show: !!client.about },
                { label: 'Services', href: '#services', show: !!client.services?.length },
                { label: 'Gallery', href: '#gallery', show: !!client.galleryImages?.length },
                { label: 'Contact', href: '#contact', show: !!c },
              ].filter((l) => l.show).map((l) => (
                <a key={l.href} href={l.href} className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--brand-surface-muted)' }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--brand-accent)' }}>Contact</p>
            <div className="flex flex-col gap-2">
              {client.location?.address && <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-surface-muted)' }}><MapPin size={16} style={{ color: 'var(--brand-accent)' }} />{client.location.address}</span>}
              {c?.phone && <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-surface-muted)' }}><Phone size={16} style={{ color: 'var(--brand-accent)' }} />{c.phone}</a>}
              {c?.email && <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-surface-muted)' }}><Mail size={16} style={{ color: 'var(--brand-accent)' }} />{c.email}</a>}
              {c?.instagram && <a href={c.instagram.startsWith('http') ? c.instagram : `https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-surface-muted)' }}><Instagram size={16} style={{ color: 'var(--brand-accent)' }} />{c.instagram}</a>}
              {c?.website && <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-surface-muted)' }}><Globe size={16} style={{ color: 'var(--brand-accent)' }} />{c.website}</a>}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(var(--brand-surface-muted-rgb), 0.12)' }}>
          <p className="text-xs" style={{ color: 'var(--brand-surface-muted)' }}>&copy; {year} {client.businessName}. All rights reserved.</p>
          <p className="text-xs" style={{ color: 'var(--brand-surface-muted)' }}>Powered by Horizon Works Demo Engine</p>
        </div>
      </Container>
    </footer>
  );
}
