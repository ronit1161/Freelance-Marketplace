import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/gigs");
    }
  };

  const popularTags = ["React", "Mobile Apps", "UI/UX Design", "Copywriting", "SEO"];

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-4xl">
          Find the Perfect Freelancer for Any Project
        </h1>

        <p className="mt-4 text-base md:text-lg text-blue-100 max-w-2xl">
          Connect with talented developers, designers, writers, and marketers from around the world.
        </p>

        {/* Integrated Search Bar */}
        <form onSubmit={handleSearch} className="mt-8 w-full max-w-xl">
          <div className="bg-white p-1.5 rounded-xl shadow-md flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What service are you looking for?"
              className="w-full py-2.5 px-4 text-sm md:text-base outline-none bg-transparent text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm md:text-base whitespace-nowrap transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Popular Quick Search Tags */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-blue-100">
          <span className="font-medium opacity-80">Popular:</span>
          {popularTags.map((tag) => (
            <Link
              key={tag}
              to={`/gigs?search=${encodeURIComponent(tag)}`}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition">
              Hire Talent
            </button>
          </Link>

          <Link to="/signup">
            <button className="border border-white/80 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold transition">
              Become a Freelancer
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
