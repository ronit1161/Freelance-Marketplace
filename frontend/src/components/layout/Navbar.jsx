import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userRole = user?.role?.toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo & Role indicator */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-2xl font-bold text-[#0058be]">
            FreelanceMarketplace
          </Link>
          {user && (
            <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
              {userRole}
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
          {user && userRole === 'CLIENT' && (
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
          {user && userRole === 'FREELANCER' && (
            <>
              <Link to="/freelancer" className="text-gray-700 hover:text-[#0058be] transition">
                Dashboard
              </Link>
              <Link to="/freelancer/create-gig" className="text-gray-700 hover:text-[#0058be] transition">
                Create Gig
              </Link>
              <Link to="/freelancer/edit-profile" className="text-gray-700 hover:text-[#0058be] transition">
                Edit Profile
              </Link>
              <Link to="/freelancer/profile" className="text-gray-700 hover:text-[#0058be] transition">
                About Me
              </Link>
            </>
          )}

          {/* Admin Navbar */}
          {user && userRole === 'ADMIN' && (
            <>
              <Link to="/admin" className="text-gray-700 hover:text-[#0058be] transition">
                Admin Console
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
                to={userRole === 'CLIENT' ? "/client/profile" : "/freelancer/profile"}
                className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border hover:border-blue-500 transition"
                title="View Profile"
              >
                <span>{user.name ? user.name[0].toUpperCase() : (user.fullName ? user.fullName[0].toUpperCase() : 'U')}</span>
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
