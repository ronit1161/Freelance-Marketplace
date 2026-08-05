import React from "react";
import HeroSection from "../components/HeroSection";
import TrustStatsBar from "../components/TrustStatsBar";
import PopularCategoriesSection from "../components/PopularCategoriesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import WhyUsSection from "../components/WhyUsSection";
import CtaSection from "../components/CtaSection";

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section with Search & Popular Tags */}
      <HeroSection />

      {/* 2. Platform Trust & Statistics Bar */}
      <TrustStatsBar />

      {/* 3. Popular Categories Section */}
      <PopularCategoriesSection />

      {/* 4. How It Works Section */}
      <HowItWorksSection />

      {/* 5. Why Choose Us Section */}
      <WhyUsSection />

      {/* 6. Call To Action Conversion Banner */}
      <CtaSection />
    </div>
  );
}
