import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="text-[#0058be] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              FreelanceHub
            </h2>

            <p className="text-gray-400">
              Connect with talented freelancers and
              clients from around the world.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">
              Company
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about">About Us</Link>
              </li>

              <li>
                <Link to="/careers">Careers</Link>
              </li>

              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Freelancers */}
          <div>
            <h3 className="font-semibold mb-4">
              Freelancers
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/find-work">
                  Find Work
                </Link>
              </li>

              <li>
                <Link to="/create-gig">
                  Create Gig
                </Link>
              </li>

              <li>
                <Link to="/earnings">
                  Earnings
                </Link>
              </li>
            </ul>
          </div>

          {/* Clients */}
          <div>
            <h3 className="font-semibold mb-4">
              Clients
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/post-project">
                  Post Project
                </Link>
              </li>

              <li>
                <Link to="/hire">
                  Hire Talent
                </Link>
              </li>

              <li>
                <Link to="/support">
                  Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          © 2026 FreelanceHub. All rights reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer