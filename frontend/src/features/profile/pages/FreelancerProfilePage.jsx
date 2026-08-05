import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getUserById } from "../../../services/userApi";
import ProfileHeroCard from "../components/ProfileHeroCard";
import ProfileInfoGrid from "../components/ProfileInfoGrid";
import { User, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function FreelancerProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadUserProfileData();
    }
  }, [user?.id]);

  const loadUserProfileData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUserById(user.id);
      setProfileData(data || user);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setError(err?.message || "Failed to load profile details.");
      setProfileData(user);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw size={24} className="animate-spin text-[#0058be] mx-auto" />
          <p className="text-xs text-gray-500 font-semibold">Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error || "Profile data not found."}</span>
        </div>
      </div>
    );
  }

  const roleUpper = (profileData.role || user?.role || "USER").toUpperCase();
  const displayAvatar = profileData.profileAvatarURL || user?.profileAvatarURL || "";
  const skillsArray = profileData.skills
    ? profileData.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/freelancer"
          className="flex items-center gap-2 text-xs font-bold text-[#0058be] hover:underline transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Console</span>
        </Link>
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Profile Management
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* HERO AVATAR HEADER CARD */}
      <ProfileHeroCard
        profileData={profileData}
        displayAvatar={displayAvatar}
        roleUpper={roleUpper}
        onEditClick={() => navigate("/freelancer/edit-profile")}
      />

      {/* BIOGRAPHY, SKILLS & DETAILS GRID */}
      <ProfileInfoGrid
        profileData={profileData}
        skillsArray={skillsArray}
      />
    </div>
  );
}