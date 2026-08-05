import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getUserById, updateUserProfile } from "../../../services/userApi";

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
        experience,
      });

      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      setMessage("Profile updated successfully!");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        {error && <p className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</p>}
        {message && <p className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar URL */}
          <div>
            <label className="block font-medium mb-2">Profile Avatar URL</label>
            <input
              type="text"
              placeholder="https://avatar.com/image.jpg"
              value={profileAvatarURL}
              onChange={(e) => setProfileAvatarURL(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-medium mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* Bio Data */}
          <div>
            <label className="block font-medium mb-2">About Me / Bio Data</label>
            <textarea
              rows="4"
              placeholder="Tell clients about yourself..."
              value={bioData}
              onChange={(e) => setBioData(e.target.value)}
              className="w-full border rounded-lg p-3 resize-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-medium mb-2">Skills (Comma-separated)</label>
            <input
              type="text"
              placeholder="React, Spring Boot, Java, MySQL"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              min="0"
              placeholder="3"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}