import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function RegisterPage() {
  const [role, setRole] = useState("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const isFormValid =
    role &&
    name.trim() !== "" &&
    password.length >= 4 &&
    accepted;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await register({ role, name, email, password, accepted });
      if (role === "client") navigate("/client");
      else if (role === "freelancer") navigate("/freelancer");
      else navigate("/");
    } catch (err) {
      setError(err?.message || "Registration failed");
      console.error("Register Error:", err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Select Account Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-semibold transition ${role === "client"
                    ? "bg-blue-50 border-blue-600 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                Hire Talent (Client)
              </button>
              <button
                type="button"
                onClick={() => setRole("freelancer")}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-semibold transition ${role === "freelancer"
                    ? "bg-blue-50 border-blue-600 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                Work & Earn (Freelancer)
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              required
            />
          </div>

          <div className="flex items-start gap-2 text-sm text-slate-600 mt-1">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 rounded text-blue-600 focus:ring-blue-500"
            />
            <p>
              I agree to the{" "}
              <a href="/terms" className="text-blue-500 hover:underline">
                Terms & Conditions
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`p-3 rounded-xl font-semibold transition mt-2 shadow-sm ${isFormValid
                ? "bg-[#0058be] hover:bg-[#004bb0] text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            Create Account
          </button>

          <p className="text-sm text-center text-slate-600 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

