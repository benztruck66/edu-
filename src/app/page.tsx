import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StatsSection } from "@/components/StatsSection";
import { TopUniversitiesSection } from "@/components/TopUniversitiesSection";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TopUniversitiesSection />
      <CTASection />
    </>
  );
}
