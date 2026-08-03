import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getUserById, updateUserProfile } from "../../../services/userApi";
import { getWalletByUserId } from "../../../services/walletapi";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Wallet,
  Edit3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Award,
  Code,
  FileText,
  Camera,
  X,
  ArrowLeft,
  Briefcase,
} from "lucide-react";

export default function FreelancerProfilePage() {
  const { user, setUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [profileAvatarURL, setProfileAvatarURL] = useState("");
  const [bioData, setBioData] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState(0);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Sample Avatar Presets for quick selection
  const sampleAvatars = [
    { label: "Developer", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
    { label: "Designer", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
    { label: "Executive", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    { label: "Creative", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" },
  ];

  useEffect(() => {
    if (user?.id) {
      loadFullProfile();
    }
  }, [user?.id]);

  const loadFullProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const [data, walletData] = await Promise.all([
        getUserById(user.id),
        getWalletByUserId(user.id).catch(() => null),
      ]);

      setProfileData(data);
      setWallet(walletData);

      // Initialize form fields
      setFullName(data.fullName || "");
      setProfileAvatarURL(data.profileAvatarURL || "");
      setBioData(data.bioData || "");
      setSkills(data.skills || "");
      setExperience(data.experience || 0);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(err?.message || "Failed to load profile information.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Open Edit Mode
  const handleStartEdit = () => {
    if (profileData) {
      setFullName(profileData.fullName || "");
      setProfileAvatarURL(profileData.profileAvatarURL || "");
      setBioData(profileData.bioData || "");
      setSkills(profileData.skills || "");
      setExperience(profileData.experience || 0);
    }
    setFormError("");
    setIsEditing(true);
  };

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setFormError("");

    const trimmedFullName = fullName.trim();
    if (!trimmedFullName) {
      setFormError("Full Name cannot be empty.");
      return;
    }

    if (experience < 0) {
      setFormError("Years of experience cannot be negative.");
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await updateUserProfile(user.id, {
        fullName: trimmedFullName,
        profileAvatarURL: profileAvatarURL.trim(),
        bioData: bioData.trim(),
        skills: skills.trim(),
        experience: parseInt(experience, 10) || 0,
      });

      // Update Auth context and local storage
      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));

      showSuccess("Profile updated successfully!");
      setIsEditing(false);
      await loadFullProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      setFormError(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Formatted Skills Array
  const skillsArray = (profileData?.skills || skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="max-w-4xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <User size={16} />
            <span>Freelancer Profile</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">My Professional Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and update your personal details, skills, and portfolio information.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/freelancer"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Console</span>
          </Link>
          {!isEditing && (
            <button
              onClick={handleStartEdit}
              className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center gap-2"
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2 bg-white rounded-3xl border border-gray-100 p-8">
          <RefreshCw size={18} className="animate-spin text-[#0058be]" />
          <span>Loading profile details...</span>
        </div>
      )}

      {/* READ-ONLY VIEW MODE */}
      {!loading && profileData && !isEditing && (
        <div className="space-y-8">
          {/* Main Hero Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100 pb-6">
              {/* Profile Picture */}
              <div className="relative shrink-0">
                {profileData.profileAvatarURL ? (
                  <img
                    src={profileData.profileAvatarURL}
                    alt={profileData.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : null}

                {/* Avatar Fallback Badge */}
                {(!profileData.profileAvatarURL) && (
                  <div className="w-24 h-24 rounded-full bg-blue-100 text-[#0058be] flex items-center justify-center font-extrabold text-3xl border-4 border-white shadow-md">
                    {(profileData.fullName || profileData.userName || "F")[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {profileData.fullName || "Freelancer Name"}
                  </h2>
                  <span className="px-3 py-1 bg-blue-50 text-[#0058be] border border-blue-200 text-xs font-bold rounded-full uppercase tracking-wider self-center sm:self-auto">
                    {profileData.role || "FREELANCER"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-500 font-mono">@{profileData.userName}</p>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {profileData.bioData || "No biography provided yet. Edit profile to share your background."}
                </p>
              </div>
            </div>

            {/* Profile Grid Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* Email (Read-Only) */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Mail size={14} className="text-[#0058be]" />
                  <span>Email (Read-Only)</span>
                </span>
                <p className="font-bold text-slate-900 font-mono truncate">{profileData.email}</p>
              </div>

              {/* Username */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <User size={14} className="text-[#0058be]" />
                  <span>Username</span>
                </span>
                <p className="font-bold text-slate-900 font-mono">@{profileData.userName}</p>
              </div>

              {/* System Role */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Shield size={14} className="text-[#0058be]" />
                  <span>Role</span>
                </span>
                <p className="font-bold text-blue-600">{profileData.role || "FREELANCER"}</p>
              </div>

              {/* Experience */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Award size={14} className="text-[#0058be]" />
                  <span>Experience</span>
                </span>
                <p className="font-bold text-slate-900">
                  {profileData.experience || 0} {profileData.experience === 1 ? "Year" : "Years"}
                </p>
              </div>

              {/* Wallet Summary */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Wallet size={14} className="text-[#0058be]" />
                  <span>Wallet Balance</span>
                </span>
                <p className="font-bold text-emerald-600 font-mono text-sm">
                  ₹{wallet ? wallet.balance : "0.00"}
                </p>
              </div>

              {/* Joined Date */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#0058be]" />
                  <span>Joined Date</span>
                </span>
                <p className="font-bold text-slate-900">
                  {profileData.createdOn || "Marketplace Member"}
                </p>
              </div>
            </div>

            {/* Skills Tag Cloud */}
            <div className="pt-2 space-y-2">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Code size={14} className="text-[#0058be]" />
                <span>Professional Skills</span>
              </span>

              {skillsArray.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No skills listed yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skillsArray.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-blue-50 text-[#0058be] border border-blue-100 font-semibold text-xs rounded-xl"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE FORM MODE */}
      {!loading && isEditing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Profile Information</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Update your professional profile and credentials.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-slate-900 transition p-1"
            >
              <X size={20} />
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
            {/* Live Profile Picture / Avatar Preview & Input */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              {/* Image Preview Box */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-blue-400 shrink-0 flex items-center justify-center shadow-sm">
                {profileAvatarURL.trim() ? (
                  <img
                    src={profileAvatarURL.trim()}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                ) : (
                  <Camera size={24} className="text-gray-400" />
                )}
              </div>

              <div className="space-y-2 flex-1 w-full">
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Profile Picture / Avatar URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={profileAvatarURL}
                  onChange={(e) => setProfileAvatarURL(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />

                {/* Avatar Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider self-center">Presets:</span>
                  {sampleAvatars.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileAvatarURL(preset.url)}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-[#0058be] border border-gray-200 rounded-lg text-[10px] font-semibold text-slate-700 transition"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Read-Only Fields Row (Email & Role & Username) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  Email Address (Read-Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={profileData?.email || ""}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs text-gray-500 bg-gray-100 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  Username (Read-Only)
                </label>
                <input
                  type="text"
                  disabled
                  value={profileData?.userName || ""}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs text-gray-500 bg-gray-100 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  System Role (Read-Only)
                </label>
                <input
                  type="text"
                  disabled
                  value={profileData?.role || "FREELANCER"}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs text-blue-600 bg-gray-100 cursor-not-allowed font-bold"
                />
              </div>
            </div>

            {/* Editable Fields */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ronit Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                About Me / Biography
              </label>
              <textarea
                rows="4"
                placeholder="Tell prospective clients about your expertise, workflow, and technical background..."
                value={bioData}
                onChange={(e) => setBioData(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Spring Boot, Java, MySQL, UI/UX"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 3"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}