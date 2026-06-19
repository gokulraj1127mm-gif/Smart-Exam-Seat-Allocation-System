import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaUserCircle,
  FaEnvelope,
  FaUserShield,
  FaSignOutAlt,
  FaIdCard,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  // Parse state safety guardrails
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Failed to parse user profile context storage metrics:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar />

        <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
          
          {/* Header Section */}
          <div className="border-b border-slate-200 pb-5">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <FaIdCard className="text-blue-600" /> Identity Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage system authentication flags, view account operational privileges, and log configurations.
            </p>
          </div>

          {/* Premium Account Card Container */}
          <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden max-w-2xl mx-auto relative group">
            {/* Top Design Accent Banner */}
            <div className="h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 w-full relative" />

            <div className="px-8 pb-8 relative">
              {/* Profile Avatar Frame Alignment Offset */}
              <div className="flex justify-center -mt-16 mb-4">
                <div className="bg-white p-1.5 rounded-full shadow-md border border-slate-100 group-hover:scale-105 transition duration-300">
                  <FaUserCircle className="text-slate-200 bg-slate-800 rounded-full text-[96px] border border-slate-700" />
                </div>
              </div>

              {/* Identity Presentation Meta */}
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {user?.name || "Admin User"}
                </h2>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold font-mono uppercase bg-blue-50 text-blue-700 border border-blue-100 tracking-wider">
                  {user?.role || "Administrator"}
                </span>
              </div>

              <div className="my-6 border-t border-slate-100" />

              {/* Core Parameters Stack */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Security Parameters Info
                </div>

                <div className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition duration-150">
                  <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg text-sm">
                    <FaUserShield />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wide">Access Authorization Scope</span>
                    <span className="text-sm font-bold text-slate-700 mt-0.5">{user?.role || "Administrator"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition duration-150">
                  <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg text-sm">
                    <FaEnvelope />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wide">Registered Mail Address</span>
                    <span className="text-sm font-bold text-slate-700 mt-0.5">{user?.email || "admin@college.com"}</span>
                  </div>
                </div>
              </div>

              {/* Action Operations Zone */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs tracking-wide flex items-center gap-2 shadow-sm shadow-rose-100 transition active:scale-[0.98]"
                >
                  <FaSignOutAlt className="text-[11px]" />
                  Terminate Session
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;