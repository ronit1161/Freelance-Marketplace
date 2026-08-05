import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CategoryCard from "../../../components/common/CategoryCard";

export default function PopularCategoriesSection() {
  const categories = [
    { title: "Web Development", count: "1,240+ Gigs" },
    { title: "Mobile Apps", count: "850+ Gigs" },
    { title: "UI/UX Design", count: "960+ Gigs" },
    { title: "Graphic Design", count: "1,120+ Gigs" },
    { title: "Content Writing", count: "740+ Gigs" },
    { title: "Digital Marketing", count: "630+ Gigs" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Explore Skills</span>
          <h2 className="text-3xl font-bold text-slate-900">Popular Categories</h2>
          <p className="text-gray-500 text-sm mt-1">Browse services by specialized domains and expertise</p>
        </div>

        <Link
          to="/gigs"
          className="inline-flex items-center space-x-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
        >
          <span>Browse All Categories</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat, idx) => (
          <CategoryCard key={idx} title={cat.title} count={cat.count} to={`/gigs?category=${encodeURIComponent(cat.title)}`} />
        ))}
      </div>
    </section>
  );
}
