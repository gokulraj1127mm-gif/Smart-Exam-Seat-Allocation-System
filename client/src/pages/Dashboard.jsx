import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaChair,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";

// Framer Motion Animation Variants for Staggered Orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.2 } },
};

// Shimmer Effect Variants for Skeleton Loading States
const shimmerVariants = {
  animate: {
    x: ["-100%", "100%"],
    transition: { repeat: Infinity, duration: 1.4, ease: "linear" },
  },
};

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    classrooms: 0,
    exams: 0,
    seats: 0,
  });
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token") || "";

    try {
      // 1. Fetch Students
      const studentRes = await axios.get("https://smart-exam-seat-allocation-system.onrender.com/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. Fetch Classrooms
      const classroomRes = await axios.get("https://smart-exam-seat-allocation-system.onrender.com/api/classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3. Fetch Exams
      const examRes = await axios.get("https://smart-exam-seat-allocation-system.onrender.com/api/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const examList = examRes.data.data || [];
      setUpcomingExams(examList);

      // 4. Fetch Allocated Seats
      let allocatedCount = 0;
      try {
        const allocationRes = await axios.get("https://smart-exam-seat-allocation-system.onrender.com/api/allocation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        allocatedCount = allocationRes.data.count || allocationRes.data.data?.length || 0;
      } catch (allocErr) {
        console.error("Non-blocking error fetching dynamic allocations:", allocErr);
      }

      setStats({
        students: studentRes.data.count || studentRes.data.data?.length || 0,
        classrooms: classroomRes.data.count || classroomRes.data.data?.length || 0,
        exams: examRes.data.count || examList.length || 0,
        seats: allocatedCount,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const dashboardCards = [
    { title: "Total Students", value: stats.students, icon: <FaUsers />, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-100" },
    { title: "Classrooms", value: stats.classrooms, icon: <FaChalkboardTeacher />, color: "from-green-500 to-green-600", shadow: "shadow-green-100" },
    { title: "Exams Scheduled", value: stats.exams, icon: <FaBook />, color: "from-purple-500 to-purple-600", shadow: "shadow-purple-100" },
    { title: "Allocated Seats", value: stats.seats, icon: <FaChair />, color: "from-orange-500 to-orange-600", shadow: "shadow-orange-100" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <motion.div 
          className="p-6 md:p-8 space-y-8 overflow-y-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-5">
            <div>
              <motion.h1 
                className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
              >
                Welcome Admin <span className="animate-bounce origin-bottom-right inline-block">👋</span>
              </motion.h1>
              <p className="text-gray-500 text-sm mt-1">
                Monitor system metrics, coordinate automated schedules, and manage student seat distributions.
              </p>
            </div>
            
            {/* Real-time Refresh Action Indicator */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchDashboardData}
              className="mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 text-gray-700 transition"
            >
              Sync Database Live
            </motion.button>
          </div>

          {/* Core Stat Grid Wrapper */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                // Skeleton Metrics Cards Shimmer Array Layout
                Array(4).fill(0).map((_, i) => (
                  <div key={`sk-card-${i}`} className="relative overflow-hidden bg-white h-28 rounded-2xl border border-gray-100 shadow-sm p-5">
                    <motion.div variants={shimmerVariants} animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent w-full" />
                    <div className="w-12 h-4 bg-gray-200 rounded mb-4" />
                    <div className="w-20 h-8 bg-gray-200 rounded" />
                  </div>
                ))
              ) : (
                dashboardCards.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden group hover:shadow-lg transition-shadow duration-300`}
                  >
                    {/* Floating ambient glow structure */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div>
                      <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">{item.title}</p>
                      <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">
                        {item.value.toLocaleString()}
                      </h2>
                    </div>
                    <div className={`bg-gradient-to-br ${item.color} text-white p-4 rounded-xl text-xl shadow-md ${item.shadow} transform group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Activities + Actions Multi-Grid Framework Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Box: Recent Logs System Activity Feed */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  System Operation Status
                </h2>
                <ul className="space-y-4">
                  {[
                    "Seat allocation synchronized with database records.",
                    "System configuration metrics verified.",
                    "Dynamic roster imports checked.",
                    "Examination system parameters online.",
                  ].map((text, idx) => (
                    <motion.li 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      key={idx} 
                      className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
                    >
                      <span className="flex-shrink-0 text-green-500 bg-green-50 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                      <span className="font-medium">{text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                <span>All engines executing nominal operations</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              </div>
            </motion.div>

            {/* Right Box: Dynamic Action Trigger Palette */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-5">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Add Student", baseStyle: "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-600" },
                  { name: "Add Classroom", baseStyle: "bg-green-50 border-green-100 text-green-700 hover:bg-green-600" },
                  { name: "Create Exam", baseStyle: "bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-600" },
                  { name: "Generate Seats", baseStyle: "bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-600" },
                ].map((action, idx) => (
                  <motion.button
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={idx}
                    className={`p-4 border rounded-xl text-sm font-bold flex items-center justify-between transition-all duration-200 group ${action.baseStyle} hover:text-white hover:shadow-md`}
                  >
                    <span>{action.name}</span>
                    <FaArrowRight className="opacity-60 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Dynamic Table Block Node */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <FaCalendarAlt className="text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Scheduled Exams</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Live roster entries pulling directly from server logs</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full">
                {upcomingExams.length} Active Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-bold">
                    <th className="py-4 px-6">Exam / Subject Details</th>
                    <th className="py-4 px-6">Target Department</th>
                    <th className="py-4 px-6">Date Coordinates</th>
                    <th className="py-4 px-6">Assigned Session</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium divide-y divide-gray-100">
                  <AnimatePresence>
                    {loading ? (
                      // Skeleton Row Components Shimmer Array Layout
                      Array(3).fill(0).map((_, i) => (
                        <tr key={`sk-row-${i}`} className="relative overflow-hidden h-16">
                          <td colSpan="4" className="p-0">
                            <motion.div variants={shimmerVariants} animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent w-full" />
                            <div className="mx-6 my-4 h-5 bg-gray-100 rounded w-1/3" />
                          </td>
                        </tr>
                      ))
                    ) : upcomingExams.length > 0 ? (
                      upcomingExams.map((exam, i) => (
                        <motion.tr 
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.04 }}
                          key={exam._id || i}
                          className="hover:bg-gray-50/80 transition duration-150 group"
                        >
                          <td className="py-4 px-6 text-gray-900">
                            <span className="font-mono bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border border-gray-200 mr-2 shadow-sm group-hover:bg-white transition">
                              {exam.examCode || exam.subjectCode || "N/A"}
                            </span>
                            <span className="font-bold text-gray-800">
                              {exam.examName || exam.subjectName ? `${exam.examName || exam.subjectName}` : ""}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-500 font-semibold">{exam.department || "All Modules"}</td>
                          <td className="py-4 px-6 text-gray-600 font-bold">{formatDate(exam.examDate || exam.date)}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm border ${
                              exam.session === "FN" 
                                ? "bg-blue-50 text-blue-700 border-blue-100" 
                                : "bg-amber-50 text-amber-800 border-amber-100"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${exam.session === "FN" ? "bg-blue-500" : "bg-amber-500"}`} />
                              {exam.session === "FN" ? "Forenoon (FN)" : "Afternoon (AN)"}
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <td colSpan="4" className="text-center py-12 text-gray-400 font-medium bg-gray-50/20">
                          <div className="max-w-xs mx-auto space-y-2">
                            <p className="text-base text-gray-500 font-bold">No active examinations found</p>
                            <p className="text-xs">Database clusters currently report empty schedules.</p>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;