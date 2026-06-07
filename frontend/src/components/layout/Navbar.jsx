import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div>
          <Link
            to="/"
            className="text-2xl font-bold text-[#0058be]"
          >
            FreelanceHub
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-[#0058be] transition"
          >
            Home
          </Link>

          <Link
            to="/browse"
            className="text-gray-700 hover:text-[#0058be] transition"
          >
            Browse Gigs
          </Link>

          <Link
            to="/projects"
            className="text-gray-700 hover:text-[#0058be] transition"
          >
            Projects
          </Link>

          <Link
            to="/about"
            className="text-gray-700 hover:text-[#0058be] transition"
          >
            About
          </Link>
        </nav>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
            <Link
              to={"/profile"}
            >
              R
            </Link>
          </button>
        </div>

      </div>
    </header>
  )
}

export default Navbar