import type { Metadata } from "next";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { IntroSection } from "@/features/marketing/components/intro-section";
import { SolutionsSection } from "@/features/marketing/components/solutions-section";
import { ServicesGrid } from "@/features/marketing/components/services-grid";
import { ComparisonSection } from "@/features/marketing/components/comparison-section";
import { StatsSection } from "@/features/marketing/components/stats-section";
import { TestimonialsSection } from "@/features/marketing/components/testimonials-section";
import { FaqSection } from "@/features/marketing/components/faq-section";
import { siteContent } from "@/features/marketing/constants/site-content";

export const metadata: Metadata = {
  title: `${siteContent.name} · ${siteContent.tagline}`,
  description: siteContent.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteContent.url,
    siteName: siteContent.name,
    title: `${siteContent.name} · ${siteContent.tagline}`,
    description: siteContent.description,
  },
};

export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <SolutionsSection />
      <ServicesGrid />
      <ComparisonSection />
      <StatsSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
