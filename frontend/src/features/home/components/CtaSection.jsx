import React from "react";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold max-w-3xl">
          Ready to Bring Your Projects to Life?
        </h2>

        <p className="mt-4 text-base md:text-lg text-blue-100 max-w-xl">
          Join thousands of businesses and freelancers collaborating seamlessly on our platform.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-semibold shadow transition duration-200">
              Get Started Now
            </button>
          </Link>

          <Link to="/gigs">
            <button className="border border-white/80 hover:bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold transition duration-200">
              Explore Marketplace
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
