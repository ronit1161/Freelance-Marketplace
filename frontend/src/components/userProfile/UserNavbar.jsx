// import React from 'react';
import { Compass, Briefcase, MessageSquare, Wallet, Bell } from 'lucide-react';

const UserNavbar = () => {
  return (
  <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <span className="text-xl font-bold text-blue-600 tracking-tight">Nexus Talent</span>
        
        {/* Navigation Items */}
        <nav className="flex space-x-8 text-sm font-medium text-gray-500">
          <a href="#" className="flex items-center space-x-1 hover:text-gray-900 transition">
            <Compass size={16}/> <span>Discover</span>
          </a>
          <a href="#" className="flex items-center space-x-1 text-blue-600 pb-5 -mb-5 border-b-2 border-blue-600">
            <Briefcase size={16}/> <span>Orders</span>
          </a>
          <a href="#" className="flex items-center space-x-1 hover:text-gray-900 transition">
            <MessageSquare size={16}/> <span>Messages</span>
          </a>
          <a href="#" className="flex items-center space-x-1 hover:text-gray-900 transition">
            <Wallet size={16}/> <span>Wallet</span>
          </a>
        </nav>
      </div>

      {/* Right Side Notification & Profile */}
      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-gray-600 relative transition">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <img 
          className="w-9 h-9 rounded-full object-cover border border-gray-200" 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80" 
          alt="Adrian Profile" 
        />
      </div>
    </header>
  )
}

export default UserNavbar