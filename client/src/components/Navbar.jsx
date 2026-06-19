import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
  // Pull session metadata dynamically to ensure cohesive status representation across screens
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Failed to parse user session context within navigation bar:", error);
  }

  return (
    <nav className="bg-white border-b border-slate-150 px-6 py-4 flex items-center justify-between font-sans select-none shrink-0 z-20">
      
      {/* Left Core Context Workspace Branding */}
      <div className="space-y-0.5">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          System Control Console
        </h1>
        <p className="hidden sm:block text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Smart Allocation Framework
        </p>
      </div>

      {/* Right Operations Interactive Zone */}
      <div className="flex items-center gap-5">
        
        {/* Dynamic Alert Notification Trigger */}
        
        {/* Separator Pipe Splitter */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Identity Context Profile Dropdown Summary Frame */}
        <div className="flex items-center gap-3 group cursor-pointer p-1 pr-2 rounded-xl hover:bg-slate-50 transition duration-150">
          <div className="relative shrink-0">
            <FaUserCircle className="text-3xl text-slate-300 bg-slate-800 rounded-full border border-slate-700" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="hidden sm:flex flex-col text-left min-w-0">
            <h3 className="text-xs font-black text-slate-800 tracking-tight truncate max-w-[140px]">
              {user?.name || "Admin User"}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 tracking-normal truncate max-w-[140px] mt-0.5">
              {user?.email || "admin@college.com"}
            </p>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;