import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaChair,
  FaFilePdf,
  FaUserCircle,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Students",
      path: "/students",
      icon: <FaUsers />,
    },
    {
      name: "Classrooms",
      path: "/classrooms",
      icon: <FaChalkboardTeacher />,
    },
    {
      name: "Exams",
      path: "/exams",
      icon: <FaBook />,
    },
    {
      name: "Seat Allocation",
      path: "/seat-allocation",
      icon: <FaChair />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaFilePdf />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUserCircle />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-slate-200 border-r border-slate-800/60 shadow-xl flex flex-col shrink-0 select-none hidden md:flex font-sans">

      {/* Brand Identity Header */}
      <div className="p-6 border-b border-slate-900 bg-slate-950/40 backdrop-blur-sm space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs shadow-md shadow-blue-500/10">
            <FaChair className="text-xs" />
          </div>
          <h1 className="text-base font-black tracking-tight text-white">
            Smart Classroom
          </h1>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-9.5">
          Seat Allocation System
        </p>
      </div>

      {/* Navigation Stack */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs tracking-wide uppercase transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 hover:translate-x-1"
              }`
            }
          >
            <span className="text-sm transition duration-150 group-hover:scale-110">
              {item.icon}
            </span>
            <span className="font-semibold tracking-normal normal-case text-[13px]">
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Control Footer Data */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/20">
        <p className="text-[10px] font-semibold text-slate-600 text-center uppercase tracking-wider font-mono">
          © 2026 Smart Classroom
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;