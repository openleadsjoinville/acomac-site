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
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Associação dos Comerciantes de Material de Construção de Joinville",
  url: SITE_URL,
  logo: `${SITE_URL}/LOGO%20ACOMAC%20Joinville%20-%202020%20-%20FINAL-01.avif`,
  image: `${SITE_URL}/Fachada%20acomac.png`,
  telephone: "+55-47-3435-0660",
  email: "acomac@acomacjoinville.com.br",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Princesa Isabel, 438",
    addressLocality: "Joinville",
    addressRegion: "SC",
    postalCode: "89202-260",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -26.3045,
    longitude: -48.8487,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://instagram.com/acomacjoinville",
    "https://facebook.com/acomacjoinville",
  ],
};

export default async function Home() {
  const [home, global] = await Promise.all([
    getPageContent("home"),
    getGlobalContent(),
  ]);

  return (
    <SiteChrome pageKey="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
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
