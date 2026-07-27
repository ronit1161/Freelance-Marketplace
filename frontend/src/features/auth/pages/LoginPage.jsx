import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authApi";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password });

      if (res.role === "client") navigate("/client");
      else if (res.role === "freelancer") navigate("/freelancer");
      else if (res.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(err?.message || "Login failed");
      console.error("Login Error:", err);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gray-200 p-3 rounded-lg">
          Login Page
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

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

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Sign in
          </button>

          <p className="text-sm text-center">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
