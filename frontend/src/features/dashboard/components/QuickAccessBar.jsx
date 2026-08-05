import React from "react";
import { Link } from "react-router-dom";

export default function QuickAccessBar() {
  const links = [
    { to: "/freelancer/gigs", label: "My Gigs" },
    { to: "/freelancer/create-gig", label: "Create Gig" },
    { to: "/freelancer/orders", label: "Orders" },
    { to: "/freelancer/wallet", label: "Wallet" },
    { to: "/freelancer/reviews", label: "Reviews" },
    { to: "/freelancer/profile", label: "Profile" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
        Quick Access Controls
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl text-center transition block"
          >
            <span className="text-xs font-bold text-slate-800 block">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
