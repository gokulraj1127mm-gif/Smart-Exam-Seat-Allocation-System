import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserShield, FaEnvelope, FaLock, FaGraduationCap } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hardcoded check for system admin credentials
    if (
      formData.email === "admin@college.com" &&
      formData.password === "admin123"
    ) {
      localStorage.setItem("token", "sample_jwt_token");
      localStorage.setItem("role", "admin");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Admin User",
          email: "admin@college.com",
          role: "Administrator",
        })
      );

      navigate("/dashboard"); // Static Admin Dashboard
    } else {
      alert("Invalid Admin Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 text-slate-800 font-sans selection:bg-blue-500 selection:text-white p-4">
      
      {/* Decorative Blur Vectors */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md space-y-6 relative z-10">
        
        {/* Portal Branding Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FaUserShield className="text-2xl" />
          </div>
          <div className="space-y-1 pt-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin </h2>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Smart Seat Allocation Engine
            </p>
          </div>
        </div>

        {/* Access Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Form Row */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">Institutional Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition duration-150">
                <FaEnvelope className="text-sm" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@college.com"
                className="w-full border border-slate-200 pl-11 pr-4 py-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-700 transition"
                required
              />
            </div>
          </div>

          {/* Password Form Row */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">Security Phrase</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition duration-150">
                <FaLock className="text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-slate-200 pl-11 pr-11 py-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-700 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Execution Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold tracking-wide text-sm shadow-md shadow-blue-500/10 transition active:scale-[0.99]"
            >
              Authenticate & Enter
            </button>
          </div>

          <div className="border-t border-slate-100 my-4" />

          {/* Alternative Gate Waypoint */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/student-login")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition duration-150 group"
            >
              <FaGraduationCap className="text-sm group-hover:-rotate-12 transition duration-150" />
              Are you an institutional student? Identify here
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;