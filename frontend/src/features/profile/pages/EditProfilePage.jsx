export default function EditProfile() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit Profile
        </h1>

        <form className="space-y-8">

          {/* Profile Image */}
          <div>
            <label className="block font-medium mb-2">
              Profile Picture
            </label>

            <input
              type="file"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Ronit Tambe"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium mb-2">
              Professional Title
            </label>

            <input
              type="text"
              placeholder="Full Stack Developer"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-2">
              Location
            </label>

            <input
              type="text"
              placeholder="Mumbai, India"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-medium mb-2">
              About Me
            </label>

            <textarea
              rows="6"
              placeholder="Tell clients about yourself..."
              className="w-full border rounded-lg p-3 resize-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-medium mb-2">
              Skills
            </label>

            <input
              type="text"
              placeholder="React, Node.js, MongoDB"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Languages */}
          <div>
            <label className="block font-medium mb-2">
              Languages
            </label>

            <input
              type="text"
              placeholder="English, Hindi"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block font-medium mb-2">
              Education
            </label>

            <textarea
              rows="3"
              placeholder="Bachelor of Engineering..."
              className="w-full border rounded-lg p-3 resize-none"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block font-medium mb-2">
              Experience
            </label>

            <textarea
              rows="4"
              placeholder="Describe your professional experience..."
              className="w-full border rounded-lg p-3 resize-none"
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block font-medium mb-2">
              Portfolio Website
            </label>

            <input
              type="url"
              placeholder="https://yourportfolio.com"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Github */}
          <div>
            <label className="block font-medium mb-2">
              GitHub Profile
            </label>

            <input
              type="url"
              placeholder="https://github.com/username"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block font-medium mb-2">
              LinkedIn Profile
            </label>

            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
}