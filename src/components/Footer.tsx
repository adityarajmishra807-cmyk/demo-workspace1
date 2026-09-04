import type { ClientConfig } from '@/types/client';
import { Container } from '@/components/ui/Section';
import { Phone, Mail, Instagram, Globe, MapPin } from 'lucide-react';

export default function Footer({ client }: { client: ClientConfig }) {
  const c = client.contact;
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t py-12 md:py-16"
      style={{ background: 'var(--brand-surface)', borderColor: 'rgba(var(--brand-surface-muted-rgb), 0.18)' }}
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-3 md:gap-12 mb-10 md:mb-12">
          <div className="min-w-0">
            {client.logo ? (
              <img src={client.logo} alt={client.businessName} className="mb-4 h-8 w-auto max-w-[180px] object-contain object-left" />
            ) : (
              <h3 className="mb-4 text-xl font-bold" style={{ color: 'var(--brand-surface-text)' }}>{client.businessName}</h3>
            )}
            {client.tagline && (
              <p className="max-w-sm text-sm leading-6" style={{ color: 'var(--brand-surface-muted)' }}>{client.tagline}</p>
            )}
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--brand-accent)' }}>Navigation</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-col">
              {[
                { label: 'About', href: '#about', show: !!client.about },
                { label: 'Services', href: '#services', show: !!client.services?.length },
                { label: 'Gallery', href: '#gallery', show: !!client.galleryImages?.length },
                { label: 'Contact', href: '#contact', show: !!c },
              ].filter((l) => l.show).map((l) => (
                <a key={l.href} href={l.href} className="w-fit text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--brand-surface-muted)' }}>{l.label}</a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-4 text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--brand-accent)' }}>Contact</p>
            <div className="flex flex-col gap-3">
              {client.location?.address && <span className="flex min-w-0 items-start gap-2 text-sm leading-6" style={{ color: 'var(--brand-surface-muted)' }}><MapPin size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--brand-accent)' }} /><span className="break-words">{client.location.address}</span></span>}
              {c?.phone && <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex min-w-0 items-center gap-2 text-sm break-words" style={{ color: 'var(--brand-surface-muted)' }}><Phone size={16} className="shrink-0" style={{ color: 'var(--brand-accent)' }} /><span>{c.phone}</span></a>}
              {c?.email && <a href={`mailto:${c.email}`} className="flex min-w-0 items-center gap-2 text-sm break-words" style={{ color: 'var(--brand-surface-muted)' }}><Mail size={16} className="shrink-0" style={{ color: 'var(--brand-accent)' }} /><span>{c.email}</span></a>}
              {c?.instagram && <a href={c.instagram.startsWith('http') ? c.instagram : `https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-2 text-sm break-words" style={{ color: 'var(--brand-surface-muted)' }}><Instagram size={16} className="shrink-0" style={{ color: 'var(--brand-accent)' }} /><span>{c.instagram}</span></a>}
              {c?.website && <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-2 text-sm break-words" style={{ color: 'var(--brand-surface-muted)' }}><Globe size={16} className="shrink-0" style={{ color: 'var(--brand-accent)' }} /><span>{c.website}</span></a>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'rgba(var(--brand-surface-muted-rgb), 0.12)' }}>
          <p className="text-xs" style={{ color: 'var(--brand-surface-muted)' }}>&copy; {year} {client.businessName}. All rights reserved.</p>
          <p className="text-xs sm:text-right" style={{ color: 'var(--brand-surface-muted)' }}>Powered by Horizon Works Demo Engine</p>
        </div>
      </Container>
    </footer>
  );
}
