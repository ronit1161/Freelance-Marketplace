import React from "react";

export default function TrustStatsBar() {
  const stats = [
    { label: "Active Freelancers", value: "10,000+" },
    { label: "Projects Completed", value: "25,000+" },
    { label: "Satisfaction Rate", value: "99.8%" },
    { label: "Safe Transactions", value: "100% Escrow" },
  ];

  return (
    <section className="bg-white border-b border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-2">
              <div className="text-3xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
