import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { AboutSection } from '@/components/home/AboutSection';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Index = () => {
  const { data: settings } = useSiteSettings();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
