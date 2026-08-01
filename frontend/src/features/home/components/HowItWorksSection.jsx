import StepCard from "./StepCard";

const HowItWorksSection = () => {
  return (
    <>
      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-10">
            <StepCard
              number="01"
              title="Post a Job"
              description="Tell us what you need."
            />

            <StepCard
              number="02"
              title="Hire Talent"
              description="Review proposals and choose."
            />

            <StepCard
              number="03"
              title="Get Work Done"
              description="Track progress and pay securely."
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksSection;
