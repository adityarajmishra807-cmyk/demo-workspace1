import type { ClientConfig } from '@/types/client';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function PhotographyTemplate({ client }: { client: ClientConfig }) {
  return (
    <div className="template-photography">
      <Navbar client={client} />
      <main>
        <Hero client={client} />
        <Gallery client={client} />
        <About client={client} />
        <Services client={client} />
        <Features client={client} />
        <CTA client={client} />
        <Contact client={client} />
      </main>
      <Footer client={client} />
    </div>
  );
}
