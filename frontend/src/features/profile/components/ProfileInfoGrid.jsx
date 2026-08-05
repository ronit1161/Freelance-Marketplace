import React from "react";
import { UserCheck, Award, Wrench, ShieldCheck, Mail, Shield } from "lucide-react";

export default function ProfileInfoGrid({ profileData, skillsArray }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left 2 Columns: Bio Data & Skills */}
      <div className="lg:col-span-2 space-y-6">
        {/* Biography */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-3">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-[#0058be]" />
            <h3 className="font-bold text-slate-900 text-base">About Me</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-200 whitespace-pre-line">
            {profileData.bioData?.trim() || "No biography details provided yet."}
          </p>
        </div>

        {/* Skills Cloud */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-3">
          <div className="flex items-center gap-2">
            <Wrench size={18} className="text-[#0058be]" />
            <h3 className="font-bold text-slate-900 text-base">Skills & Expertise</h3>
          </div>

          {skillsArray.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium">No skills listed.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {skillsArray.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-blue-50 text-[#0058be] font-bold text-xs rounded-xl border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Key Details Sidebar */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <h3 className="font-bold text-slate-900 text-base border-b border-gray-100 pb-3">
          Account Specifications
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <Award size={14} className="text-[#0058be]" /> Experience
            </span>
            <span className="font-bold text-slate-900">
              {profileData.experience ? `${profileData.experience} Years` : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> Identity Status
            </span>
            <span className="font-bold text-emerald-600">Verified</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" /> Account Type
            </span>
            <span className="font-bold text-slate-900">
              {profileData.role || "User"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
