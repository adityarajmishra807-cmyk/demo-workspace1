import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';

export default function Gallery({ client }: { client: ClientConfig }) {
  if (!client.galleryImages?.length) return null;

  return (
    <Section id="gallery" className="py-20 md:py-32">
      <Container>
        <div className="mb-12 text-center md:mb-20">
          <p className="mb-4 text-sm uppercase tracking-[0.3em]" style={{ color: 'var(--brand-accent)' }}>Gallery</p>
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl" style={{ color: 'var(--brand-background-text)' }}>Our Work</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {client.galleryImages.map((img, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-xl bg-[var(--brand-surface)] ${i % 5 === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt={img.alt}
                  className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center transition-opacity duration-300 group-hover:opacity-80" style={{ background: 'var(--brand-surface)' }}>
                  <span className="px-4 text-center text-xs leading-5" style={{ color: 'var(--brand-surface-muted)' }}>{img.alt}</span>
                </div>
              )}
              {img.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-4 pb-4 pt-10 text-sm font-medium text-white opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
