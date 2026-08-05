import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  UserCheck,
  Mail,
  User,
  ShieldCheck,
  FolderTree,
  Briefcase,
  ShoppingBag,
  LayoutDashboard,
  Calendar,
} from "lucide-react";

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <ShieldCheck size={16} />
            <span>Admin Executive Suite</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your administrative profile and platform control quick links.
          </p>
        </div>

        <Link
          to="/admin"
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-8">
        {/* Profile Header Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100 pb-8">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-[#0058be] flex items-center justify-center font-extrabold text-3xl border-4 border-white shadow-md shrink-0">
            {(user?.fullName || user?.userName || "A")[0].toUpperCase()}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {user?.fullName || "System Administrator"}
              </h2>
              <span className="px-3 py-1 bg-blue-50 text-[#0058be] border border-blue-200 text-xs font-bold rounded-full uppercase tracking-wider self-center sm:self-auto">
                {user?.role || "ADMIN"}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-500 font-mono">@{user?.userName || "admin"}</p>
            <p className="text-xs text-gray-400">
              Super Administrator Account with full system authority.
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <User size={14} className="text-[#0058be]" />
              <span>Full Name</span>
            </span>
            <p className="text-base font-bold text-slate-900">
              {user?.fullName || "System Administrator"}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Mail size={14} className="text-[#0058be]" />
              <span>Email Address</span>
            </span>
            <p className="text-base font-bold text-slate-900">
              {user?.email || "admin@marketplace.com"}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <UserCheck size={14} className="text-[#0058be]" />
              <span>System Role Authority</span>
            </span>
            <p className="text-base font-bold text-blue-600">
              PLATFORM_ADMINISTRATOR
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0058be]" />
              <span>Account Status</span>
            </span>
            <p className="text-base font-bold text-emerald-600">
              Active System Account
            </p>
          </div>
        </div>

        {/* Quick Access Control Links */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
            Admin Console Management Quick Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin"
              className="p-4 bg-white border border-gray-200 hover:border-blue-400 rounded-2xl transition shadow-sm flex items-center gap-3"
            >
              <LayoutDashboard size={20} className="text-[#0058be]" />
              <div>
                <p className="font-bold text-xs text-slate-900">Dashboard</p>
                <p className="text-[10px] text-gray-500">Platform overview</p>
              </div>
            </Link>

            <Link
              to="/admin/categories"
              className="p-4 bg-white border border-gray-200 hover:border-blue-400 rounded-2xl transition shadow-sm flex items-center gap-3"
            >
              <FolderTree size={20} className="text-[#0058be]" />
              <div>
                <p className="font-bold text-xs text-slate-900">Categories</p>
                <p className="text-[10px] text-gray-500">Manage categories</p>
              </div>
            </Link>

            <Link
              to="/admin/gigs"
              className="p-4 bg-white border border-gray-200 hover:border-blue-400 rounded-2xl transition shadow-sm flex items-center gap-3"
            >
              <Briefcase size={20} className="text-[#0058be]" />
              <div>
                <p className="font-bold text-xs text-slate-900">Gigs</p>
                <p className="text-[10px] text-gray-500">Moderate gigs</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
