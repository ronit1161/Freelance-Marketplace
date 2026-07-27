import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApi";

function RegisterPage() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isFormValid =
    role &&
    name.trim() !== "" &&
    email.includes("@") &&
    password.length >= 4 &&
    accepted;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await registerUser({ role, name, email, password, accepted });
      navigate("/login");
    } catch (err) {
      setError(err?.message || "Registration failed");
      console.error("Register Error:", err);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[650px]">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gray-200 p-3 rounded-lg">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-2">
            <label className="text-sm italic text-left">Select Role</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("freelancer")}
                className={`flex-1 border p-2 rounded-md transition ${
                  role === "freelancer"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-500 hover:text-white"
                }`}
              >
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`flex-1 border p-2 rounded-md transition ${
                  role === "client"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-500 hover:text-white"
                }`}
              >
                Client
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm italic text-left">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm italic text-left">Email</label>
            <input
              type="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm italic text-left">Password</label>
            <input
              type="password"
              placeholder="xxxx"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1"
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
            className={`p-2 rounded-md transition ${
              isFormValid
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Sign Up
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
