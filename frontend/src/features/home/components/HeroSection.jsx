import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <h1 className="text-6xl font-bold">Find the Perfect Freelancer</h1>

          <p className="mt-6 text-xl text-blue-100">
            Connect with talented developers, designers, writers, and marketers
            from around the world.
          </p>

          <div className="mt-10 max-w-2xl mx-auto flex">
            <input
              type="text"
              placeholder="Search for services..."
              className="flex-1 px-5 py-4 rounded-l-lg text-black"
            />

            <button className="bg-black px-8 rounded-r-lg">Search</button>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link to={"/signup"}>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
                Hire Talent
              </button>
            </Link>

            <Link to={"/signup"}>
              <button className="border border-white px-6 py-3 rounded-lg font-semibold">
                Become a Freelancer
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
