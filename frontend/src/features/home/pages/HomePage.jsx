import CategoryCard from "../../../components/common/CategoryCard";
import HeroSection from "../components/HeroSection";
import WhyUsSection from "../components/WhyUsSection";
import HowItWorksSection from "../components/HowItWorksSection";

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      <HeroSection />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-10">Popular Categories</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <CategoryCard title="Web Development" />
          <CategoryCard title="Mobile Apps" />
          <CategoryCard title="UI/UX Design" />
          <CategoryCard title="Graphic Design" />
          <CategoryCard title="Content Writing" />
        </div>
      </section>

      <HowItWorksSection />

      <WhyUsSection />
    </div>
  );
}
