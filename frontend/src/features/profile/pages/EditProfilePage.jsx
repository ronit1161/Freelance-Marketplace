import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getUserById, updateUserProfile } from "../../../services/userApi";
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Camera } from "lucide-react";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [profileAvatarURL, setProfileAvatarURL] = useState(user?.profileAvatarURL || "");
  const [bioData, setBioData] = useState(user?.bioData || "");
  const [skills, setSkills] = useState(user?.skills || "");
  const [experience, setExperience] = useState(user?.experience || 0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getUserById(user.id)
        .then((data) => {
          setFullName(data.fullName || "");
          setProfileAvatarURL(data.profileAvatarURL || "");
          setBioData(data.bioData || "");
          setSkills(data.skills || "");
          setExperience(data.experience || 0);
        })
        .catch((err) => console.error("Failed to load user profile", err))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const updatedUser = await updateUserProfile(user.id, {
        fullName,
        profileAvatarURL,
        bioData,
        skills,
        experience: parseInt(experience, 10) || 0,
        email: user?.email,
        role: user?.role,
        userName: user?.userName,
      });

      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      setMessage("Profile updated successfully!");
      setLoading(false);

      setTimeout(() => {
        navigate('/freelancer/profile');
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError(err?.message || "Failed to update profile.");
    }
  };

  const backLink = '/freelancer/profile';

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs text-[#0058be] font-bold uppercase tracking-wider block mb-1">
            Account Management
          </span>
          <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Update your personal details, bio, avatar, and professional skills.
          </p>
        </div>

        <Link
          to={backLink}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Profile</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Avatar Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-blue-400 shrink-0 flex items-center justify-center shadow-sm">
              {profileAvatarURL.trim() ? (
                <img
                  src={profileAvatarURL.trim()}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
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
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio Data */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              About Me / Biography
            </label>
            <textarea
              rows="4"
              placeholder="Tell clients about yourself..."
              value={bioData}
              onChange={(e) => setBioData(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Skills & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Skills (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="React, Spring Boot, Java, MySQL"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                placeholder="3"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-3.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(backLink)}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}