import React from "react";

const WhyUsSection = () => {
  const benefits = [
    {
      title: "Verified Freelancers",
      description: "Work with vetted professionals who have proven skills and real client reviews.",
    },
    {
      title: "Secure Payments",
      description: "Payments are held securely in escrow and released only when you approve the work.",
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock to help resolve any issue.",
    },
  ];

  return (
    <section className="bg-blue-600 text-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">Why Choose Our Marketplace?</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="p-6">
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
              <p className="mt-3 text-blue-100 text-sm leading-relaxed max-w-xs mx-auto">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
