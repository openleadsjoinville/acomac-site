import SiteChrome from "@/components/SiteChrome";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import BenefitsSection from "@/components/BenefitsSection";
import InfrastructureSection from "@/components/InfrastructureSection";
import CoursesSection from "@/components/CoursesSection";
import EventsSection from "@/components/EventsSection";
import PartnersSection from "@/components/PartnersSection";
import NewsSection from "@/components/NewsSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import { getGlobalContent, getPageContent } from "@/lib/content/get";

export default async function Home() {
  const [home, global] = await Promise.all([
    getPageContent("home"),
    getGlobalContent(),
  ]);

  return (
    <SiteChrome pageKey="home">
      <HeroSection data={home.hero} globalContent={global} />
      <AboutSection about={home.about} stats={home.stats} globalContent={global} />
      <EventsSection data={home.events} />
      <BenefitsSection data={home.benefits} />
      <InfrastructureSection data={home.infrastructure} />
      <CoursesSection data={home.courses} />
      <PartnersSection data={home.partners} />
      <NewsSection data={home.news} />
      <CTASection cta={global.cta} phone={global.contactInfo.phone} globalContent={global} />
      <ContactSection contactForm={global.contactForm} />
    </SiteChrome>
  );
}
