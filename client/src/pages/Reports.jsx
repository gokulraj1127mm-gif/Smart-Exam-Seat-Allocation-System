import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaFilePdf,
  FaUsers,
  FaChair,
  FaClipboardList,
  FaDownload,
  FaChartPie,
  FaBuilding,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa";

function Reports() {
  const [stats, setStats] = useState({
    students: 0,
    classrooms: 0,
    exams: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter criteria states for dynamic scoped backend queries
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSession, setSelectedSession] = useState("");

  const reportTemplates = [
    {
      id: "overall-seating-rep",
      title: "Overall Seating Arrangement",
      description: "Official institutional notice board layout matching college exam standards.",
      isBackendReport: true,
    },
    {
      id: "student-rep",
      title: "Student Report",
      description: "Complete database list of registered students for administration check.",
      isBackendReport: false,
    },
    {
      id: "classroom-rep",
      title: "Classroom Report",
      description: "Overview of available spaces, rooms, and physical structural dimensions.",
      isBackendReport: false,
    },
    {
      id: "exam-rep",
      title: "Exam Report",
      description: "Scheduled examination master blocks, courses, and reference timetables.",
      isBackendReport: false,
    },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [studentRes, classroomRes, examRes] = await Promise.all([
        axios.get("http://localhost:5000/api/students", config),
        axios.get("http://localhost:5000/api/classrooms", config),
        axios.get("http://localhost:5000/api/exams", config),
      ]);

      const studentsData = studentRes.data.data || studentRes.data || [];
      const classroomsData = classroomRes.data.data || classroomRes.data || [];
      const examsData = examRes.data.data || examRes.data || [];

      setStats({
        students: studentsData.length,
        classrooms: classroomsData.length,
        exams: examsData.length,
      });

      setRecentReports([
        { name: "Overall Seating Arrangement", date: new Date().toLocaleDateString(), type: "System Sheet" },
        { name: "Student Report", date: new Date().toLocaleDateString(), type: "PDF Document" },
        { name: "Classroom Report", date: new Date().toLocaleDateString(), type: "PDF Document" },
        { name: "Exam Report", date: new Date().toLocaleDateString(), type: "PDF Document" },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadOverallSeatingReport = () => {
    if (!selectedDate || !selectedSession) {
      alert("Please select a target Exam Date and Session before compiling the seating notice layout!");
      return;
    }
    // Securely pass target contexts down as clean query strings to filter out historical artifacts
    window.open(
      `http://localhost:5000/api/reports/overall-seating?date=${selectedDate}&session=${selectedSession}`,
      "_blank"
    );
  };

  const downloadStudentReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const students = res.data.data || res.data || [];

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Student Master Report", 14, 15);

      autoTable(doc, {
        startY: 25,
        head: [["Reg No", "Name", "Department", "Year"]],
        body: students.map((student) => [
          student.registerNumber || "N/A",
          student.name || "N/A",
          student.department || "N/A",
          student.year || "N/A",
        ]),
        headStyles: { fillColor: [15, 23, 42] },
      });

      doc.save("student-report.pdf");
    } catch (error) {
      console.error(error);
      alert("Failed to generate Student Report");
    }
  };

  const downloadClassroomReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const classrooms = res.data.data || res.data || [];

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Classroom Layout Report", 14, 15);

      autoTable(doc, {
        startY: 25,
        head: [["Hall No", "Hall Name", "Capacity", "Rows", "Columns"]],
        body: classrooms.map((room) => [
          room.hallNo || "N/A",
          room.hallName || "N/A",
          room.capacity || "N/A",
          room.rows || "N/A",
          room.columns || "N/A",
        ]),
        headStyles: { fillColor: [15, 23, 42] },
      });

      doc.save("classroom-report.pdf");
    } catch (error) {
      console.error(error);
      alert("Failed to generate Classroom Report");
    }
  };

  const downloadExamReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const exams = res.data.data || res.data || [];

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Exam Schedule Report", 14, 15);

      autoTable(doc, {
        startY: 25,
        head: [["Subject Code", "Subject Name", "Dept", "Date", "Session"]],
        body: exams.map((exam) => [
          exam.subjectCode || "N/A",
          exam.subjectName || "N/A",
          exam.department || "N/A",
          exam.date ? exam.date.split("T")[0] : "N/A",
          exam.session || "N/A",
        ]),
        headStyles: { fillColor: [15, 23, 42] },
      });

      doc.save("exam-report.pdf");
    } catch (error) {
      console.error(error);
      alert("Failed to generate Exam Report");
    }
  };

  const handleDownload = (title) => {
    if (title === "Overall Seating Arrangement") downloadOverallSeatingReport();
    if (title === "Student Report") downloadStudentReport();
    if (title === "Classroom Report") downloadClassroomReport();
    if (title === "Exam Report") downloadExamReport();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar />

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                <FaChartPie className="text-blue-600" /> Reports & Intelligence
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Generate authenticated examination indices, structural floor templates, and data analytics sheets.
              </p>
            </div>
          </div>

          {/* Quick Stats Metric Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition duration-200 group">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Registered Enrolments</h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{stats.students}</h2>
              </div>
              <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                <FaUsers />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition duration-200 group">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Allocated Elements</h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{stats.students}</h2>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-xl group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                <FaChair />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition duration-200 group">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">System Environments</h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{stats.classrooms}</h2>
              </div>
              <div className="bg-purple-50 text-purple-600 p-4 rounded-xl text-xl group-hover:bg-purple-600 group-hover:text-white transition duration-300">
                <FaBuilding />
              </div>
            </div>
          </div>

          {/* Context Control Panel Filter for Overall Seating Arrangement */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Seating Compilation Settings
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select target properties to filter out historical artifacts and generate clean data streams.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FaCalendarAlt className="text-slate-300" /> Target Exam Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2.5 rounded-xl bg-slate-50/50 focus:bg-white text-sm font-bold text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FaClock className="text-slate-300" /> Operational Session
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2.5 rounded-xl bg-slate-50/50 focus:bg-white text-sm font-bold text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="">Select Session Context</option>
                  <option value="FN">FN (Forenoon Session)</option>
                  <option value="AN">AN (Afternoon Session)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Template Grid Canvas */}
          <div>
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-blue-600 rounded-full" /> Operational Export Channels
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTemplates.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition duration-200 group relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 transition-all duration-200 ${
                      report.isBackendReport ? "bg-blue-600" : "bg-rose-500"
                    }`}
                  />
                  
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3.5 rounded-xl text-xl shrink-0 transition ${
                        report.isBackendReport
                          ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                          : "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white"
                      }`}
                    >
                      {report.isBackendReport ? <FaClipboardList /> : <FaFilePdf />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition duration-150">
                        {report.title}
                      </h3>
                      <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleDownload(report.title)}
                      className={`w-full font-bold px-4 py-2.5 rounded-xl transition duration-150 text-xs flex justify-center items-center gap-2 tracking-wide ${
                        report.isBackendReport
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"
                          : "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-100"
                      }`}
                    >
                      <FaDownload className="text-[10px]" />
                      {report.isBackendReport ? "Compile Notice Sheet" : "Generate Export Document"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Execution Ledger */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Compilation Log Ledger</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time compilation history vectors of active data scopes.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold tracking-wider uppercase">
                    <th className="py-4 px-6">Report Context Structure</th>
                    <th className="py-4 px-6">Timestamp Vector</th>
                    <th className="py-4 px-6">Document Class</th>
                    <th className="py-4 px-6 text-center">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold divide-y divide-slate-100 text-slate-700">
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <tr key={`sk-row-${i}`} className="animate-pulse">
                        <td colSpan="4" className="py-4.5 px-6">
                          <div className="h-5 bg-slate-100 rounded-lg w-full" />
                        </td>
                      </tr>
                    ))
                  ) : recentReports.length > 0 ? (
                    recentReports.map((report, index) => (
                      <tr key={index} className="hover:bg-slate-50/80 transition duration-150">
                        <td className="py-4 px-6 font-bold text-slate-900">{report.name}</td>
                        <td className="py-4 px-6 text-slate-500 font-mono text-xs">{report.date}</td>
                        <td className="py-4 px-6">
                          <span className={`text-[11px] font-bold px-2 py-0.5 border rounded-md font-mono ${
                            report.type === "System Sheet" 
                              ? "bg-blue-50 text-blue-700 border-blue-100" 
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}>
                            {report.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide inline-block">
                            Available
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-slate-400 font-medium">
                        No recent reports generated.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;