import React from "react";
import StepCard from "./StepCard";

const HowItWorksSection = () => {
  return (
    <section className="bg-white py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Simple Process</span>
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="text-gray-500 text-sm mt-2">Get your projects completed in 3 easy steps with total transparency</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <StepCard
            number="01"
            title="Post a Project"
            description="Tell us what you need done, set your timeline, budget, and project requirements."
          />

          <StepCard
            number="02"
            title="Hire Top Talent"
            description="Browse proposals, compare freelancer portfolios, ratings, and choose the best match."
          />

          <StepCard
            number="03"
            title="Get Work Done Safely"
            description="Collaborate in real-time, track milestone progress, and release payments securely upon approval."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
