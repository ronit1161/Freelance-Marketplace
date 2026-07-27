import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bell, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem("auth_user");
    if (session) {
      setUser(JSON.parse(session));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
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
          {user && user.role === 'client' && (
            <>
              <Link to="/client" className="text-gray-700 hover:text-[#0058be] transition">
                Dashboard
              </Link>
              <Link to="/client/projects" className="text-gray-700 hover:text-[#0058be] transition">
                Projects
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
          {user && user.role === 'freelancer' && (
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
          {user && user.role === 'admin' && (
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
              {/* Notification icon for logged in users */}
              <button className="text-gray-400 hover:text-gray-600 relative transition">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>

              {/* User Avatar */}
              <Link
                to={user.role === 'client' ? "/client/profile" : "/freelancer/profile"}
                className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border hover:border-blue-500 transition"
                title="View Profile"
              >
                <span>{user.name ? user.name[0].toUpperCase() : 'U'}</span>
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
