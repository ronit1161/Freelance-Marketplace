import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `transition font-medium py-5 border-b-2 flex items-center ${
      isActive ? "text-[#0058be] font-bold border-[#0058be]" : "text-gray-700 border-transparent hover:text-[#0058be]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo & Role indicator */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-2xl font-bold text-[#0058be]">
            FreelanceHub
          </Link>
          {user && (
            <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
              {user.role}
            </span>
          )}
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium h-full">
          {/* Guest Navbar */}
          {!user && (
            <>
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/gigs" className={navLinkClass}>
                Browse Gigs
              </NavLink>
            </>
          )}

          {/* Client Navbar */}
          {user && user.role?.toLowerCase() === 'client' && (
            <>
              <NavLink to="/client" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/client/orders" className={navLinkClass}>
                Orders
              </NavLink>
              <NavLink to="/client/wallet" className={navLinkClass}>
                Wallet
              </NavLink>
              <NavLink to="/gigs" className={navLinkClass}>
                Browse Gigs
              </NavLink>
            </>
          )}

          {/* Freelancer Navbar */}
          {user && user.role?.toLowerCase() === 'freelancer' && (
            <>
              <NavLink to="/freelancer" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/freelancer/gigs" className={navLinkClass}>
                My Gigs
              </NavLink>
              <NavLink to="/freelancer/orders" className={navLinkClass}>
                Orders
              </NavLink>
              <NavLink to="/freelancer/wallet" className={navLinkClass}>
                Wallet
              </NavLink>
              <NavLink to="/freelancer/reviews" className={navLinkClass}>
                Reviews
              </NavLink>
              <NavLink to="/freelancer/create-gig" className={navLinkClass}>
                Create Gig
              </NavLink>
            </>
          )}

          {/* Admin Navbar */}
          {user && user.role?.toLowerCase() === 'admin' && (
            <>
              <NavLink to="/admin" end className={navLinkClass}>
                Admin Overview
              </NavLink>
              <NavLink to="/admin/categories" className={navLinkClass}>
                Categories
              </NavLink>
              <NavLink to="/admin/gigs" className={navLinkClass}>
                Gigs
              </NavLink>
              <NavLink to="/admin/orders" className={navLinkClass}>
                Order Management
              </NavLink>
            </>
          )}
        </nav>

        {/* Profile & Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <NotificationBell />

              {/* User Avatar */}
              <NavLink
                to={
                  user.role?.toLowerCase() === 'admin'
                    ? "/admin/profile"
                    : user.role?.toLowerCase() === 'client'
                      ? "/client/profile"
                      : "/freelancer/profile"
                }
                className={({ isActive }) =>
                  `w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border transition ${
                    isActive
                      ? "bg-[#0058be] text-white border-[#0058be]"
                      : "bg-blue-100 text-blue-600 border-transparent hover:border-blue-500"
                  }`
                }
                title="View Profile"
              >
                <span>{(user.fullName || user.userName || user.name || 'U')[0].toUpperCase()}</span>
              </NavLink>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-gray-700 hover:text-[#0058be] px-4 py-2 text-sm font-semibold transition">
                Sign In
              </Link>
              <Link to="/signup" className="bg-[#0058be] hover:bg-[#004bb0] text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
                Join
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-slate-900 p-1.5 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3 shadow-lg">
          {!user && (
            <div className="flex flex-col gap-3 font-semibold text-sm">
              <NavLink to="/" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Home</NavLink>
              <NavLink to="/gigs" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Browse Gigs</NavLink>
            </div>
          )}

          {user && user.role?.toLowerCase() === 'client' && (
            <div className="flex flex-col gap-3 font-semibold text-sm">
              <NavLink to="/client" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Dashboard</NavLink>
              <NavLink to="/client/orders" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Orders</NavLink>
              <NavLink to="/client/wallet" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Wallet</NavLink>
              <NavLink to="/gigs" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Browse Gigs</NavLink>
              <NavLink to="/client/profile" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">My Profile</NavLink>
            </div>
          )}

          {user && user.role?.toLowerCase() === 'freelancer' && (
            <div className="flex flex-col gap-3 font-semibold text-sm">
              <NavLink to="/freelancer" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Dashboard</NavLink>
              <NavLink to="/freelancer/gigs" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">My Gigs</NavLink>
              <NavLink to="/freelancer/orders" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Orders</NavLink>
              <NavLink to="/freelancer/wallet" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Wallet</NavLink>
              <NavLink to="/freelancer/reviews" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Reviews</NavLink>
              <NavLink to="/freelancer/create-gig" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Create Gig</NavLink>
              <NavLink to="/freelancer/profile" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Profile</NavLink>
            </div>
          )}

          {user && user.role?.toLowerCase() === 'admin' && (
            <div className="flex flex-col gap-3 font-semibold text-sm">
              <NavLink to="/admin" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Admin Overview</NavLink>
              <NavLink to="/admin/categories" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Categories</NavLink>
              <NavLink to="/admin/gigs" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Gigs</NavLink>
              <NavLink to="/admin/orders" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Order Management</NavLink>
              <NavLink to="/admin/profile" onClick={closeMobileMenu} className="text-gray-700 hover:text-[#0058be]">Admin Profile</NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
