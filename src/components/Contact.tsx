import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';
import { Phone, Mail, MessageCircle, Instagram, Globe, MapPin } from 'lucide-react';

export default function Contact({ client }: { client: ClientConfig }) {
  const c = client.contact;
  if (!c) return null;

  const items: { icon: React.ReactNode; label: string; value: string; href?: string }[] = [];

  if (c.contactName) {
    items.push({
      icon: <MapPin size={22} style={{ color: 'var(--brand-accent)' }} />,
      label: 'Contact Person',
      value: c.contactName,
    });
  }
  if (c.phone) {
    items.push({
      icon: <Phone size={22} style={{ color: 'var(--brand-accent)' }} />,
      label: 'Phone',
      value: c.phone,
      href: `tel:${c.phone.replace(/\s/g, '')}`,
    });
  }
  if (c.email) {
    items.push({
      icon: <Mail size={22} style={{ color: 'var(--brand-accent)' }} />,
      label: 'Email',
      value: c.email,
      href: `mailto:${c.email}`,
    });
  }
  if (c.whatsapp) {
    items.push({
      icon: <MessageCircle size={22} style={{ color: 'var(--brand-accent)' }} />,
      label: 'WhatsApp',
      value: c.whatsapp,
      href: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}`,
    });
  }
  if (c.instagram) {
    items.push({
      icon: <Instagram size={22} style={{ color: 'var(--brand-accent)' }} />,
      label: 'Instagram',
      value: c.instagram,
      href: c.instagram.startsWith('http') ? c.instagram : `https://instagram.com/${c.instagram.replace('@', '')}`,
    });
  }
  if (c.website) {
    items.push({
      icon: <Globe size={22} style={{ color: 'var(--brand-accent)' }} />,
      label: 'Website',
      value: c.website,
      href: c.website.startsWith('http') ? c.website : `https://${c.website}`,
    });
  }

  if (items.length === 0) return null;

  return (
    <Section id="contact" className="py-20 md:py-32">
      <Container className="max-w-4xl">
        <div className="text-center mb-14">
          <p
            className="text-sm uppercase tracking-[0.3em] mb-4"
            style={{ color: 'var(--brand-accent)' }}
          >
            Contact
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{ color: 'var(--brand-text)' }}
          >
            Get in Touch
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((item, i) => {
            const content = (
              <div
                className="flex items-center gap-4 p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'var(--brand-surface)',
                  borderColor: 'rgba(var(--brand-muted-rgb), 0.12)',
                }}
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full shrink-0"
                  style={{
                    background: 'var(--brand-accent-soft)',
                    border: '1px solid var(--brand-accent-border)',
                  }}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: 'var(--brand-muted)' }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-base font-medium truncate"
                    style={{ color: 'var(--brand-text)' }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            );
            return item.href ? (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                {content}
              </a>
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
