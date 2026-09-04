import { Phone, Mail, MessageCircle, Instagram, Globe, MapPin, ArrowUpRight } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import type { ClientConfig } from '@/types/client';

export default function Contact({ client }: { client: ClientConfig }) {
  const c = client.contact;
  if (!c) return null;

  const items: { icon: React.ReactNode; label: string; value: string; href?: string; external?: boolean }[] = [];
  if (c.contactName) items.push({ icon: <MapPin size={20} />, label: 'Contact Person', value: c.contactName });
  if (c.phone) items.push({ icon: <Phone size={20} />, label: 'Phone', value: c.phone, href: `tel:${c.phone.replace(/\s/g, '')}` });
  if (c.email) items.push({ icon: <Mail size={20} />, label: 'Email', value: c.email, href: `mailto:${c.email}` });
  if (c.whatsapp) items.push({ icon: <MessageCircle size={20} />, label: 'WhatsApp', value: c.whatsapp, href: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}`, external: true });
  if (c.instagram) items.push({ icon: <Instagram size={20} />, label: 'Instagram', value: c.instagram, href: c.instagram.startsWith('http') ? c.instagram : `https://instagram.com/${c.instagram.replace('@', '')}`, external: true });
  if (c.website) items.push({ icon: <Globe size={20} />, label: 'Website', value: c.website, href: c.website.startsWith('http') ? c.website : `https://${c.website}`, external: true });
  if (!items.length) return null;

  return (
    <Section id="contact" className="relative py-24 md:py-36 overflow-hidden">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.35em] md:text-sm" style={{ color: 'var(--brand-accent)' }}>Contact</p>
            <h2 className="mb-6 text-5xl font-medium leading-[1.05] md:text-6xl" style={{ color: 'var(--brand-text)' }}>Let’s talk.</h2>
            <p className="max-w-md text-base leading-8 md:text-lg" style={{ color: 'var(--brand-muted)' }}>
              Have a question or ready to take the next step? Reach out through whichever channel is most convenient.
            </p>
            <div className="mt-10 h-px w-24" style={{ background: 'var(--brand-accent)' }} />
          </div>
          <div className="grid overflow-hidden rounded-2xl border sm:grid-cols-2" style={{ borderColor: 'rgba(var(--brand-muted-rgb), 0.16)' }}>
            {items.map((item, i) => {
              const content = (
                <div className="group relative min-h-[146px] border-b p-6 transition-all duration-300 hover:bg-white/[0.025] sm:min-h-[158px] sm:p-7" style={{ borderColor: 'rgba(var(--brand-muted-rgb), 0.16)' }}>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: 'var(--brand-accent-border)', color: 'var(--brand-accent)' }}>{item.icon}</span>
                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: 'var(--brand-muted)' }} />
                  </div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--brand-muted)' }}>{item.label}</p>
                  <p className="break-words text-sm font-medium leading-6 sm:text-base" style={{ color: 'var(--brand-text)' }}>{item.value}</p>
                </div>
              );
              return item.href ? <a key={i} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} className="block min-w-0">{content}</a> : <div key={i}>{content}</div>;
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
