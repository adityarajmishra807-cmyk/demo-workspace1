import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';

export default function Gallery({ client }: { client: ClientConfig }) {
  if (!client.galleryImages?.length) return null;

  return (
    <Section id="gallery" className="py-20 md:py-32">
      <Container>
        <div className="text-center mb-14 md:mb-20">
          <p className="text-sm uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--brand-accent)' }}>Gallery</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold" style={{ color: 'var(--brand-background-text)' }}>Our Work</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {client.galleryImages.map((img, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-xl ${i % 5 === 0 ? 'col-span-2 row-span-2' : ''}`}>
              {img.url ? (
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 aspect-square" loading="lazy" />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center transition-all duration-300 group-hover:opacity-80" style={{ background: 'var(--brand-surface)' }}>
                  <span className="text-xs text-center px-4" style={{ color: 'var(--brand-surface-muted)' }}>{img.alt}</span>
                </div>
              )}
              {img.caption && (
                <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82), transparent 60%)' }}>
                  <p className="text-sm font-medium text-white">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
