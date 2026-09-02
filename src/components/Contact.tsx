import type { ClientConfig } from '@/types/client';
import { Phone, Mail, MessageCircle, Instagram, Globe, MapPin, ArrowUpRight } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';

export default function Contact({ client }: { client: ClientConfig }) {
  const c = client.contact;
  if (!c) return null;

  const items: { icon: React.ReactNode; label: string; value: string; href?: string }[] = [];
  if (c.contactName) items.push({ icon: <MapPin size={20} />, label: 'Contact Person', value: c.contactName });
  if (c.phone) items.push({ icon: <Phone size={20} />, label: 'Phone', value: c.phone, href: `tel:${c.phone.replace(/\s/g, '')}` });
  if (c.email) items.push({ icon: <Mail size={20} />, label: 'Email', value: c.email, href: `mailto:${c.email}` });
  if (c.whatsapp) items.push({ icon: <MessageCircle size={20} />, label: 'WhatsApp', value: c.whatsapp, href: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}` });
  if (c.instagram) items.push({ icon: <Instagram size={20} />, label: 'Instagram', value: c.instagram, href: c.instagram.startsWith('http') ? c.instagram : `https://instagram.com/${c.instagram.replace('@', '')}` });
  if (c.website) items.push({ icon: <Globe size={20} />, label: 'Website', value: c.website, href: c.website.startsWith('http') ? c.website : `https://${c.website}` });
  if (!items.length) return null;

  return (
    <Section id="contact" className="relative py-24 md:py-36 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-24 items-start">
          <div>
            <p className="text-xs md:text-sm uppercase tracking-[0.35em] mb-5" style={{ color: 'var(--brand-accent)' }}>Contact</p>
            <h2 className="text-5xl md:text-6xl font-medium leading-[1.05] mb-6" style={{ color: 'var(--brand-text)' }}>Let’s talk.</h2>
            <p className="text-base md:text-lg leading-8 max-w-md" style={{ color: 'var(--brand-muted)' }}>
              Have a question or ready to take the next step? Reach out through whichever channel is most convenient.
            </p>
            <div className="mt-10 h-px w-24" style={{ background: 'var(--brand-accent)' }} />
          </div>
          <div className="grid sm:grid-cols-2 border-t border-l" style={{ borderColor: 'rgba(var(--brand-muted-rgb), 0.16)' }}>
            {items.map((item, i) => {
              const content = (
                <div className="group relative h-full min-h-[150px] p-6 md:p-8 border-r border-b transition-all duration-300 hover:bg-white/[0.025]" style={{ borderColor: 'rgba(var(--brand-muted-rgb), 0.16)' }}>
                  <div className="flex items-center justify-between mb-10">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ borderColor: 'var(--brand-accent-border)', color: 'var(--brand-accent)' }}>{item.icon}</span>
                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: 'var(--brand-muted)' }} />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--brand-muted)' }}>{item.label}</p>
                  <p className="text-base font-medium truncate" style={{ color: 'var(--brand-text)' }}>{item.value}</p>
                </div>
              );
              return item.href ? <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="block">{content}</a> : <div key={i}>{content}</div>;
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
