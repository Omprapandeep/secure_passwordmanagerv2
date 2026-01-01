import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");

    const navigate = useNavigate();


    const handleSignup = async (e) => {
        e.preventDefault();


        const res = await fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Signup successful");
            navigate("/login");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-4">

            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">

                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-white mb-2">
                    Create Account
                </h2>
                <p className="text-center text-gray-300 mb-6">
                    Sign up to manage your passwords securely
                </p>

                {/* Form */}
                <form onSubmit={handleSignup} className="space-y-4">

                    <input
                        placeholder="Username"
                        onChange={e => setUsername(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />

                    <input
                        type="email"
                        placeholder="Email (must be @gmail.com)"
                        value={email}
                        onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);

                            if (!value) {
                                setEmailError("Email is required");
                            } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
                                setEmailError("Only @gmail.com addresses are allowed");
                            } else {
                                setEmailError("");
                            }
                        }}
                        className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none transition
    ${emailError
                                ? "border border-red-400 focus:ring-2 focus:ring-red-400"
                                : email
                                    ? "border border-emerald-400 focus:ring-2 focus:ring-emerald-400"
                                    : "border border-white/20"
                            }
  `}
                    />

                    {emailError && (
                        <p className="text-sm text-red-400 mt-1">
                            {emailError}
                        </p>
                    )}


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
                        Sign Up
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-300 mt-6">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-emerald-400 hover:underline cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );

}

export default Signup;
