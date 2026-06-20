import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaSignOutAlt, 
  FaUser, 
  FaChair, 
  FaFileDownload, 
  FaGraduationCap, 
  FaBuilding, 
  FaCalendarAlt, 
  FaClock, 
  FaIdCard 
} from "react-icons/fa";

function StudentDashboard() {
  const navigate = useNavigate();
  const [seatingData, setSeatingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read student profile safely from localStorage
  const student = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!student) {
      navigate("/student-login");
      return;
    }

    const fetchSeating = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://smart-exam-seat-allocation-system.onrender.com/api/allocation/student/${student.regNo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setSeatingData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching student profile allocation details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeating();
  }, [navigate, student?.regNo]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student-login");
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation / Identity Header Bar */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0">
              <FaGraduationCap />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Student Portal</h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Active Session: <span className="text-slate-600 font-semibold">{student.name}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide flex items-center gap-2 transition shadow-sm active:scale-[0.98]"
          >
            <FaSignOutAlt className="text-slate-400 text-[11px]" />
            Terminate Session
          </button>
        </div>

        {/* Workspace Matrix Distribution Splitter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Left Block: Profile Details Profile Summary card */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
            
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <FaUser className="text-emerald-500 text-sm" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Profile Registry</h2>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex flex-col border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Full Name</span>
                <span className="text-slate-800 text-sm font-bold mt-0.5">{student.name}</span>
              </div>
              
              <div className="flex flex-col border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Registration ID</span>
                <span className="text-slate-800 font-mono font-bold mt-0.5">{student.regNo}</span>
              </div>

              <div className="flex flex-col border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Department Scope</span>
                <span className="text-slate-800 font-bold mt-0.5">{student.department}</span>
              </div>

              <div className="flex flex-col border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Academic Year</span>
                <span className="text-slate-800 font-bold mt-0.5">Year {student.year}</span>
              </div>

              <div className="flex flex-col pt-0.5 min-w-0">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">System Email</span>
                <span className="text-slate-800 font-bold mt-0.5 truncate block">{student.email}</span>
              </div>
            </div>
          </div>

          {/* Right Block: Live Seating Dynamic Tracking Sheet */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-150 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[360px]">
            <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />
            
            <div>
              <div className="flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-100">
                <FaChair className="text-blue-600 text-sm" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Exam Seating Arrangement</h2>
              </div>
              
              {loading ? (
                <div className="space-y-4 py-6 animate-pulse">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-slate-100 rounded-xl" />
                    <div className="h-20 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="h-24 bg-slate-100 rounded-xl" />
                </div>
              ) : seatingData ? (
                <div className="space-y-5">
                  
                  {/* Highlight Coordinates Badges */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-100 p-5 rounded-2xl text-center group transition">
                      <span className="text-[10px] font-bold uppercase text-blue-500 tracking-widest block">Hall Assignment</span>
                      <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{seatingData.hallNo}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50/30 border border-indigo-100 p-5 rounded-2xl text-center group transition">
                      <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-widest block">Allocated Seat</span>
                      <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight font-mono">{seatingData.seatNo}</p>
                    </div>
                  </div>

                  {/* Complete Target Metadata Ledger Box */}
                  <div className="bg-slate-50/60 rounded-xl p-4 space-y-3.5 text-xs font-semibold border border-slate-100">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-2.5 gap-4">
                      <span className="text-slate-400 font-bold uppercase tracking-wide flex items-center gap-1.5 shrink-0 mt-0.5">
                        <FaIdCard className="text-[11px]" /> Subject
                      </span>
                      <span className="font-bold text-slate-900 text-right">
                        {seatingData.subjectCode ? (
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 mr-1.5 text-[11px]">
                            {seatingData.subjectCode}
                          </span>
                        ) : null}
                        {seatingData.subjectName || seatingData.exam}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <span className="text-slate-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
                        <FaCalendarAlt className="text-[11px]" /> Exam Date
                      </span>
                      <span className="font-bold text-slate-900 font-mono">
                        {seatingData.examDate ? new Date(seatingData.examDate).toLocaleDateString("en-GB") : "N/A"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-slate-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
                        <FaClock className="text-[11px]" /> Session Matrix
                      </span>
                      <span className={`font-black px-2.5 py-0.5 rounded-md text-[10px] tracking-wide uppercase border ${
                        seatingData.session === "AN"
                          ? "bg-purple-50 text-purple-700 border-purple-100"
                          : "bg-amber-50 text-amber-800 border-amber-100"
                      }`}>
                        {seatingData.session === "FN" ? "Forenoon (FN)" : seatingData.session === "AN" ? "Afternoon (AN)" : seatingData.session || "FN"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-6 text-center my-auto py-10">
                  <p className="font-bold text-amber-800 text-sm">No Active Space Allocated</p>
                  <p className="text-[11px] text-amber-600/80 font-medium mt-1 max-w-sm mx-auto leading-relaxed">
                    The management has not finalized or published seating maps for your targeted structural reference block codes yet.
                  </p>
                </div>
              )}
            </div>

            {/* Overall Notice Download Footer Row */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <a 
                href="https://smart-exam-seat-allocation-system.onrender.com/api/reports/seating-chart" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 underline tracking-wide transition"
              >
                <FaFileDownload className="text-[11px]" />
                Download System Notice Board Chart Layout
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;