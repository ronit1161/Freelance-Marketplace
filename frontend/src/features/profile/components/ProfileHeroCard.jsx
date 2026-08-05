import React from "react";
import { User, Edit3, ShieldCheck, Mail, Calendar } from "lucide-react";

export default function ProfileHeroCard({
  profileData,
  displayAvatar,
  roleUpper,
  onEditClick,
}) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-500 shadow-md shrink-0 flex items-center justify-center">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={profileData.fullName || "User Avatar"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
              }}
            />
          ) : (
            <User size={36} className="text-gray-400" />
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {profileData.fullName || "User Profile"}
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-blue-50 text-[#0058be] border border-blue-100">
              {roleUpper}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Mail size={14} className="text-[#0058be]" />
              <span>{profileData.email || "No email provided"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>Member ID: #{profileData.id}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center gap-2"
      >
        <Edit3 size={14} />
        <span>Edit Profile</span>
      </button>
    </div>
  );
}
