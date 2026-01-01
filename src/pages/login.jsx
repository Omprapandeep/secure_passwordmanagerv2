import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      props.setIsAuth(true);   // 👈 THIS TRIGGERS RE-RENDER
      navigate("/");

    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Login to access your secure vault
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-emerald-400 transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white transition"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>


          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold tracking-wide transition transform hover:scale-[1.01]"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-300 mt-6">
          New user?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-emerald-400 hover:underline cursor-pointer"
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );

}

export default Login;
