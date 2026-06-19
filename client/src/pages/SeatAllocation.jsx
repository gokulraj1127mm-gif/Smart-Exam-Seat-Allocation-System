import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SeatGrid from "../components/SeatGrid";
import { 
  FaChair, 
  FaMagic, 
  FaUsers, 
  FaTh, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrashAlt
} from "react-icons/fa";

function SeatAllocation() {
  const [selectedHall, setSelectedHall] = useState("");
  const [seatData, setSeatData] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExamIds, setSelectedExamIds] = useState([]); 
  const [exams, setExams] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Sync and fetch layout when the active hall context transforms
  useEffect(() => {
    if (selectedHall && classrooms.length > 0 && String(selectedHall) !== "Null") {
      fetchSavedLayout(selectedHall);
    } else {
      setSeatData([]);
    }
  }, [selectedHall, classrooms]);

  const fetchInitialData = async () => {
    try {
      const [studentRes, classroomRes, examRes] = await Promise.all([
        axios.get("http://localhost:5000/api/students", { headers }),
        axios.get("http://localhost:5000/api/classrooms", { headers }),
        axios.get("http://localhost:5000/api/exams", { headers }).catch(() => ({ data: [] }))
      ]);

      const fetchedStudents = studentRes.data.data || studentRes.data || [];
      const fetchedClassrooms = classroomRes.data.data || classroomRes.data || [];
      const fetchedExams = examRes.data.data || examRes.data || [];

      setStudents(fetchedStudents);
      setClassrooms(fetchedClassrooms);
      setExams(fetchedExams);

      if (fetchedExams.length > 0) {
        const firstId = fetchedExams[0]._id || fetchedExams[0].id;
        setSelectedExamIds([firstId]);
      }

      if (fetchedClassrooms.length > 0) {
        setSelectedHall(fetchedClassrooms[0].hallNo);
      } else {
        setSelectedHall("");
      }
    } catch (error) {
      console.error("Error fetching initial monitoring layout:", error);
    }
  };

  const fetchSavedLayout = async (hallNo) => {
    if (!hallNo || String(hallNo).trim() === "Null" || String(hallNo).trim() === "") {
      setSeatData([]);
      return;
    }

    setLoading(true);
    try {
      const cleanHall = String(hallNo).trim();
      const activeRoom = classrooms.find(room => String(room.hallNo).trim() === cleanHall);
      
      if (!activeRoom) {
        setSeatData([]);
        return;
      }

      const roomRows = activeRoom.rows || 4;
      const roomCols = activeRoom.columns || 4;

      const response = await axios.get(`http://localhost:5000/api/allocation/hall/${cleanHall}`, { headers });
      const savedAllocations = response.data.data || [];

      const allocationLookup = {};
      savedAllocations.forEach(item => {
        if (item && item.seatNo) {
          allocationLookup[item.seatNo.trim()] = item;
        }
      });

      const completeGridMatrix = [];
      for (let r = 1; r <= roomRows; r++) {
        for (let c = 1; c <= roomCols; c++) {
          const generatedSeatCode = String.fromCharCode(64 + r) + c;
          const matchFound = allocationLookup[generatedSeatCode];

          completeGridMatrix.push({
            seatNo: generatedSeatCode,
            student: matchFound ? (matchFound.regNo || matchFound.registerNo || "Allocated") : "Empty",
            studentName: matchFound ? (matchFound.studentName || matchFound.name || "") : "",
            department: matchFound ? (matchFound.department || "") : ""
          });
        }
      }

      setSeatData(completeGridMatrix);
    } catch (error) {
      console.error("Error reading mapping layout logs:", error);
      setSeatData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExamSelectionToggle = (examId) => {
    if (selectedExamIds.includes(examId)) {
      if (selectedExamIds.length > 1) {
        setSelectedExamIds(selectedExamIds.filter(id => id !== examId));
      }
    } else {
      setSelectedExamIds([...selectedExamIds, examId]);
    }
  };

  const generateSeats = async () => {
    if (!selectedHall || String(selectedHall).trim() === "") {
      alert("Please select a target hall node viewport before allocation.");
      return;
    }
    if (selectedExamIds.length === 0) {
      alert("Please select at least one assessment profile blueprint.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/allocation/generate",
        { examIds: selectedExamIds, hallNo: String(selectedHall).trim() }, 
        { headers }
      );

      if (response.data.success) {
        await fetchSavedLayout(selectedHall);
        alert("Alternating seating allocation generated and committed successfully!");
      }
    } catch (error) {
      console.error("Engine routine processing error:", error);
      alert(error.response?.data?.message || "Seat allocation calculations failed.");
    } finally {
      setLoading(false);
    }
  };

  // CLEAR LAYOUT METHOD ENGINE
  const clearCurrentLayout = async () => {
    if (!selectedHall) return;
    if (!window.confirm(`Are you sure you want to completely clear and clear the seating map grid layout for Hall ${selectedHall}?`)) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/allocation/clear",
        { hallNo: String(selectedHall).trim() },
        { headers }
      );
      await fetchSavedLayout(selectedHall);
      alert("Seating workspace matrix wiped successfully!");
    } catch (error) {
      console.error("Failed cleaning seating records database logs:", error);
      alert("Failed to clear seating matrix records safely.");
    } finally {
      setLoading(false);
    }
  };

  const allocatedCount = seatData.filter(s => s.student !== "Empty").length;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar />
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div className="border-b border-slate-200 pb-5 flex justify-between items-center">
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <FaTh className="text-blue-600" /> Matrix Seat Allocation
            </h1>
            {allocatedCount > 0 && (
              <button
                onClick={clearCurrentLayout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border border-rose-200 transition"
              >
                <FaTrashAlt /> Clear Layout Map
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border p-6 flex justify-between items-center shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1">{students.length}</h2>
              </div>
              <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-xl"><FaUsers /></div>
            </div>

            <div className="bg-white rounded-2xl border p-6 flex justify-between items-center shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seats Occupied</h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1">{allocatedCount}</h2>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-xl"><FaChair /></div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 flex justify-between items-center text-white">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Target</h3>
                <h2 className="text-2xl font-black mt-1">{selectedHall ? `Hall ${selectedHall}` : "No Target"}</h2>
              </div>
              <div className="bg-white/10 p-4 rounded-xl text-xl"><FaTh /></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="flex flex-col space-y-2 col-span-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Target Assessment Session Blueprints
                </label>
                <div className="border rounded-xl bg-slate-50/50 p-3 max-h-[140px] overflow-y-auto space-y-2">
                  {exams.length === 0 && <p className="text-xs text-slate-400 font-medium">No exam schedules found</p>}
                  {exams.map((exam) => {
                    const id = exam._id || exam.id;
                    const isChecked = selectedExamIds.includes(id);
                    const currentYear = exam.year || 1;

                    let formattedDetails = "";
                    const rawDept = exam.departments || exam.department;

                    if (Array.isArray(rawDept)) {
                      formattedDetails = rawDept.map(d => {
                        const name = typeof d === 'object' ? d.name : d;
                        const defaultSec = String(name).toUpperCase() === "EEE" ? "B" : "A";
                        const sec = String(typeof d === 'object' && d.section ? d.section : (exam.section || defaultSec)).replace(/sec\s+/i, "").trim();
                        return `${name}(${currentYear}-Sec ${sec})`;
                      }).join(", ");
                    } else if (typeof rawDept === "string") {
                      const targets = rawDept.includes(",") 
                        ? rawDept.split(",") 
                        : rawDept.match(/IT|EEE/gi) || [rawDept];

                      formattedDetails = targets.map((d) => {
                        const cleanDeptName = d.trim();
                        const dynamicTargetSec = cleanDeptName.toUpperCase() === "EEE" ? "B" : "A";
                        const fallbackSec = exam.section || dynamicTargetSec;
                        const sec = String(fallbackSec).replace(/sec\s+/i, "").trim();
                        return `${cleanDeptName}(${currentYear}-Sec ${sec})`;
                      }).join(", ");
                    }

                    return (
                      <label key={id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer text-xs font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleExamSelectionToggle(id)}
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span>
                          {exam.examName || exam.subjectName}{" "}
                          <span className="text-slate-400 font-medium">({formattedDetails})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topology Hall Viewport</label>
                <select
                  value={selectedHall}
                  onChange={(e) => setSelectedHall(e.target.value)}
                  className="w-full border p-3 rounded-xl bg-slate-50/50 text-sm font-semibold text-slate-700 outline-none"
                >
                  {classrooms.length === 0 && <option value="">No active models detected</option>}
                  {classrooms.map((room) => (
                    <option key={room._id || room.id} value={room.hallNo}>
                      Active Hall Zone: {room.hallNo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end pt-2">
                <button
                  type="button"
                  onClick={generateSeats}
                  disabled={classrooms.length === 0 || selectedExamIds.length === 0 || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl font-bold flex justify-center items-center gap-2 shadow-sm transition disabled:bg-slate-200 text-sm"
                >
                  <FaMagic />
                  {loading ? "Processing Matrices..." : "Execute Mixed Allocation"}
                </button>
              </div>
            </div>
          </div>

          {!loading && allocatedCount > 0 && selectedHall && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3.5">
              <FaCheckCircle className="text-emerald-600 text-lg mt-0.5 shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900 text-sm leading-none">Matrix Allocation Layout Synced</h3>
                <p className="text-emerald-700 text-xs mt-1.5 font-medium">
                  Active Hall Matrix Zone: <span className="font-bold">Hall {selectedHall}</span>
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border p-6 min-h-[350px] flex flex-col justify-center relative">
            {loading ? (
              <div className="text-center p-12 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mx-auto" />
                <p className="font-bold text-sm text-slate-400">Loading map workspace layout vectors...</p>
              </div>
            ) : seatData.length > 0 && allocatedCount > 0 ? (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Visual Mapping Console</div>
                <SeatGrid seats={seatData} />
              </div>
            ) : (
              <div className="text-center p-16 max-w-sm mx-auto space-y-4 border border-dashed rounded-2xl bg-slate-50/50">
                <FaExclamationTriangle className="text-xl mx-auto text-slate-400" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-700">Empty Layout Matrix</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    No structural layout elements calculated for Hall {selectedHall || "Null"}. Click "Execute Mixed Allocation" to deploy data.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SeatAllocation;