// import React from 'react';
import { LayoutDashboard, Briefcase, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function SubNavbar({ projectCount = 0 }) {
  const activeClass = "flex items-center space-x-2 pb-3 text-sm font-semibold transition-all relative border-b-2 whitespace-nowrap text-blue-600 border-blue-600";
  const inactiveClass = "flex items-center space-x-2 pb-3 text-sm font-semibold transition-all relative border-b-2 whitespace-nowrap text-gray-400 border-transparent hover:text-gray-600";

  return (
    <div className="flex space-x-8 border-b border-gray-100 mb-8 pt-2 overflow-x-auto scrollbar-none">
      <NavLink to="/client" end className={({ isActive }) => isActive ? activeClass : inactiveClass}>
        <LayoutDashboard size={16} /> <span>Dashboard</span>
      </NavLink>
      <NavLink to="/client/projects" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
        <Briefcase size={16} /> <span>All Orders ({projectCount})</span>
      </NavLink>
      <NavLink to="/client/wallet" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
        <Wallet size={16} /> <span>Wallet & Metrics</span>
      </NavLink>
    </div>
  );
}