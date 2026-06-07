import { useState } from "react";
import { loginUser } from "../../services/authApis";
//import { useNavigate } from 'react-router-dom';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //const navigate = useNavigate();

  async function handleLogin(e) {
  e.preventDefault();

  const data = {
    email,
    password,
  };

  try {
    const res = await loginUser(data);
    console.log("Login Success:", res);

    const role = res.role;

    
    if (role === "client") {
      //window.location.href = "/client-dashboard";
      //navigate("/")
      
    } else if (role === "freelancer") {
      //window.location.href = "/freelancer-dashboard";
      //navigate("/")
      
    } else {
      //window.location.href = "/";
      
    }

  } catch (err) {
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Sign in
          </button>

          {/* Redirect */}
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

export default Login;