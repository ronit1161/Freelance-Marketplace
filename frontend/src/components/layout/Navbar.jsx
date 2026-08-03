import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


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

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {/* Guest Navbar */}
          {!user && (
            <>
              <Link to="/" className="text-gray-700 hover:text-[#0058be] transition">
                Home
              </Link>
              <Link to="/gigs" className="text-gray-700 hover:text-[#0058be] transition">
                Browse Gigs
              </Link>
            </>
          )}

          {/* Client Navbar */}
          {user && user.role?.toLowerCase() === 'client' && (
            <>
              <Link to="/client" className="text-gray-700 hover:text-[#0058be] transition">
                Dashboard
              </Link>
              <Link to="/client/orders" className="text-gray-700 hover:text-[#0058be] transition">
                Orders
              </Link>
              <Link to="/client/wallet" className="text-gray-700 hover:text-[#0058be] transition">
                Wallet
              </Link>
              <Link to="/gigs" className="text-gray-700 hover:text-[#0058be] transition">
                Browse Gigs
              </Link>
            </>
          )}

          {/* Freelancer Navbar */}
          {user && user.role?.toLowerCase() === 'freelancer' && (
            <>
              <Link to="/freelancer" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Dashboard
              </Link>
              <Link to="/freelancer/gigs" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                My Gigs
              </Link>
              <Link to="/freelancer/orders" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Orders
              </Link>
              <Link to="/freelancer/wallet" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Wallet
              </Link>
              <Link to="/freelancer/reviews" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Reviews
              </Link>
              <Link to="/freelancer/create-gig" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Create Gig
              </Link>
              <Link to="/freelancer/profile" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Profile
              </Link>
            </>
          )}

          {/* Admin Navbar */}
          {user && user.role?.toLowerCase() === 'admin' && (
            <>
              <Link to="/admin" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Admin Overview
              </Link>
              <Link to="/admin/categories" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Categories
              </Link>
              <Link to="/admin/gigs" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Gigs
              </Link>
              <Link to="/admin/orders" className="text-gray-700 hover:text-[#0058be] transition font-medium">
                Order Management
              </Link>
            </>
          )}
        </nav>

        {/* Profile & Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">

              {/* User Avatar */}
              <Link
                to={
                  user.role?.toLowerCase() === 'admin'
                    ? "/admin/profile"
                    : user.role?.toLowerCase() === 'client'
                      ? "/client/profile"
                      : "/freelancer/profile"
                }
                className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border hover:border-blue-500 transition"
                title="View Profile"
              >
                <span>{(user.fullName || user.userName || user.name || 'U')[0].toUpperCase()}</span>
              </Link>

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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
