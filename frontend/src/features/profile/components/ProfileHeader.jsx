import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Edit3, UserCheck, Star, Sparkles } from 'lucide-react';

const ProfileHeader = () => {
    const { user } = useAuth();

    const fullName = user?.fullName || "Freelancer";
    const avatar = user?.profileAvatarURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80";
    const role = user?.role || "FREELANCER";
    const exp = user?.experience ? `${user.experience} Years Experience` : "Professional Freelancer";

    return (
        <header className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 max-w-7xl mx-auto">
            <img
                src={avatar}
                alt={fullName}
                className="w-36 h-36 rounded-2xl object-cover border-4 border-gray-50 shadow-md"
            />

            <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <h1 className="text-3xl font-extrabold text-slate-900">
                        {fullName}
                    </h1>
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider self-center md:self-auto border border-blue-100">
                        <Sparkles size={12} /> {role}
                    </span>
                </div>

                <p className="text-sm font-medium text-slate-500">
                    {exp}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-slate-600 pt-1">
                    <span className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                        <Star size={14} fill="currentColor" /> 5.0 Rating
                    </span>
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <UserCheck size={14} /> Verified Member
                    </span>
                </div>

                <div className="pt-2">
                    <Link
                        to="/freelancer/edit-profile"
                        className="inline-flex items-center gap-2 bg-[#0058be] hover:bg-[#004bb0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
                    >
                        <Edit3 size={16} />
                        <span>Edit Profile</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default ProfileHeader;