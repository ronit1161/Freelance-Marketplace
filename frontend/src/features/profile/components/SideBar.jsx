import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Mail, User, Briefcase, Award } from 'lucide-react';

const SideBar = () => {
    const { user } = useAuth();

    const skillsList = user?.skills
        ? user.skills.split(",").map(s => s.trim()).filter(Boolean)
        : ["Full Stack Development", "React", "Spring Boot"];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-slate-900 text-base border-b border-gray-100 pb-3">
                    Personal Details
                </h3>

                <div className="space-y-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-800">@{user?.userName || 'freelancer'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Mail size={16} className="text-blue-600 shrink-0" />
                        <span>{user?.email || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-blue-600 shrink-0" />
                        <span>{user?.experience ? `${user.experience} Years Experience` : '1+ Years Experience'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Award size={16} className="text-blue-600 shrink-0" />
                        <span>Full Time Available</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-slate-900 text-base border-b border-gray-100 pb-3">
                    Skills & Tech Stack
                </h3>

                <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 font-semibold text-xs px-3 py-1.5 rounded-xl border border-blue-100">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SideBar;