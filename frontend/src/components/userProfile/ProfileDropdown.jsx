import { useEffect, useRef } from 'react';
import { User, Shield, LogOut, Settings } from 'lucide-react';

export default function ProfileDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);

  // Close dropdown instantly if user clicks outside of the menu overlay area
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border border-gray-100 shadow-xl py-4 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right"
    >
      {/* Profile Summary Panel */}
      <div className="px-5 pb-3 border-b border-gray-50 flex items-center space-x-3">
        <img 
          className="w-11 h-11 rounded-full object-cover border border-gray-100" 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80" 
          alt="Adrian Profile" 
        />
        <div>
          <h4 className="text-sm font-bold text-slate-800">Adrian Alvarez</h4>
          <p className="text-xs text-gray-400 font-medium">adrian.a@nexuscompany.co</p>
        </div>
      </div>

      {/* Quick Stats Badging */}
      <div className="px-5 py-2.5 bg-gray-50/50 my-2 mx-3 rounded-xl flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Level</span>
        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
          Pro Enterprise
        </span>
      </div>

      {/* Action Navigation Links */}
      <div className="px-2 space-y-0.5">
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium text-left">
          <User size={16} className="text-gray-400" />
          <span>Personal Account Info</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium text-left">
          <Settings size={16} className="text-gray-400" />
          <span>Workspace Settings</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium text-left">
          <Shield size={16} className="text-gray-400" />
          <span>Security & API Access</span>
        </button>
      </div>

      {/* Dropdown Footer Action */}
      <div className="mt-3 pt-2 border-t border-gray-50 px-2">
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50/50 rounded-xl transition font-semibold text-left">
          <LogOut size={16} />
          <span>Sign Out Session</span>
        </button>
      </div>
    </div>
  );
}