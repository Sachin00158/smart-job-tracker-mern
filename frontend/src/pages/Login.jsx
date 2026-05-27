import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaBriefcase, FaEye, FaEyeSlash } from "react-icons/fa";
export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      navigate("/");
      window.location.reload();

    } catch (err) {

      console.error(err);
      setError("Invalid email or password");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden relative px-4">

      {/* GLOW EFFECTS */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-72 h-72 bg-cyan-500 opacity-20 blur-3xl rounded-full"></div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-slate-900/70 border border-slate-700 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-cyan-500 p-10 text-white relative">

          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative z-10 text-center">

            <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaBriefcase size={40} />
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Smart Job Tracker
            </h1>

            <p className="text-blue-100 leading-relaxed">
              Track applications, manage interviews and boost your career with AI-powered resume matching.
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12">

          <div className="mb-8 text-center">

            <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
  Unlock Your <span className="text-cyan-400">Career Journey</span> 🚀
</h2>

<p className="text-slate-400 text-base leading-relaxed">
  Access your smart dashboard, track applications and manage interviews like a pro.
</p>

          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="relative">

              <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-blue-500 outline-none text-white rounded-xl py-4 pl-12 pr-4 transition"
              />

            </div>

            {/* PASSWORD */}
            {/* PASSWORD */}
<div className="relative">

  <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" />

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-slate-800/80 border border-slate-700 focus:border-blue-500 outline-none text-white rounded-xl py-4 pl-12 pr-14 transition"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 hover:text-cyan-400 transition"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>

</div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:scale-[1.02] transition shadow-lg shadow-blue-500/20"
            >
              Login
            </button>

          </form>

          <p className="text-slate-400 text-center mt-6">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}