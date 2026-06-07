import { useState } from "react";
import { registerUser } from "../../services/authApis";
//import { useNavigate } from "react-router-dom";

function Signup() {

  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  //const navigate = useNavigate();

  async function handleSubmit(e) {
  e.preventDefault();

  const data = {
    role,
    name,
    email,
    password,
    accepted,
  };

  try {
    const res = await registerUser(data);
    console.log("Success:", res);
   // navigate("/login")
    
    
  } catch (err) {
    console.error("Error:", err);
  }
}

  const isFormValid =
    role &&
    name.trim() !== "" &&
    email.includes("@") &&
    password.length >= 4 &&
    accepted;





  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-95">

        <h2 className="text-2xl font-bold mb-6 text-center bg-gray-200 p-3 rounded-lg">
          Sign Up
        </h2> <br />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm italic text-left">Select Role</label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("freelancer")}
                className={`flex-1 border p-2 rounded-md transition 
                ${role === "freelancer" ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}`}
              >
                Freelancer
              </button>

              <button
                type="button"
                onClick={() => setRole("client")}
                className={`flex-1 border p-2 rounded-md transition 
                ${role === "client" ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}`}
              >
                Client
              </button>
            </div>
          </div>

          {/* Name */}
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

          {/* Terms & Conditions */}
          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1" />

            <p>
              I agree to the{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Terms & Conditions
              </a>
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`p-2 rounded-md transition ${isFormValid
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Sign Up
          </button>

          {/* Login Redirect */}
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

export default Signup;