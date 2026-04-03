import Navbar              from '@/components/landing/Navbar';
import HeroSection         from '@/components/landing/HeroSection';
import StatsSection        from '@/components/landing/StatsSection';
import ServicesSection     from '@/components/landing/ServicesSection';
import AboutUsSection      from '@/components/landing/AboutUsSection';
import HowItWorksSection   from '@/components/landing/HowItWorksSection';
import WhyItMattersSection from '@/components/landing/WhyItMattersSection';
import FooterSection       from '@/components/landing/FooterSection';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <AboutUsSection />
      <HowItWorksSection />
      <WhyItMattersSection />
      <FooterSection />
    </main>
  );
}
