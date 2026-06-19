import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaFileInvoice,
  FaPlus,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaBookOpen
} from "react-icons/fa";

function Exams() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    examName: "",
    subjectCode: "",
    subjectName: "",
    department: [], // Holds multi-department common subjects
    year: "",
    semester: "",
    date: "",
    session: "",
  });

  const availableDepartments = ["IT", "CSE", "ECE", "EEE", "MECH"];
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/exams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExams(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching exams:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Dynamic multi-checkbox handler for the common department pool array
  const handleDepartmentCheckbox = (dept) => {
    let updatedDepts = [...formData.department];
    if (updatedDepts.includes(dept)) {
      updatedDepts = updatedDepts.filter((d) => d !== dept);
    } else {
      updatedDepts.push(dept);
    }
    setFormData({ ...formData, department: updatedDepts });
  };

  const addExam = async (e) => {
    e.preventDefault();
    if (formData.department.length === 0) {
      alert("Please select at least one target department module.");
      return;
    }

    // Normalize numerical fields if the backend expects integers
    const payload = {
      ...formData,
      year: formData.year ? Number(formData.year) : "",
      semester: formData.semester ? Number(formData.semester) : ""
    };

    try {
      await axios.post("http://localhost:5000/api/exams", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Exam Configuration Protocol Initialized Successfully");
      setFormData({
        examName: "",
        subjectCode: "",
        subjectName: "",
        department: [], 
        year: "",
        semester: "",
        date: "",
        session: "",
      });
      fetchExams();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to commit exam vector block.");
      console.error("Error adding exam:", err);
    }
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this exam profile?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/exams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Exam Profile Decommissioned");
      setExams(exams.filter((exam) => (exam._id || exam.id) !== id));
    } catch (err) {
      alert("Decommission Protocol Rejected By Server");
      console.error("Error deleting exam:", err);
    }
  };

  // Adjusted to securely query strings inside the array structures
  const filteredExams = exams.filter((exam) => {
    const searchLower = search.toLowerCase();
    const deptString = Array.isArray(exam?.department)
      ? exam.department.join(", ")
      : String(exam?.department || "");

    return (
      exam?.examName?.toLowerCase().includes(searchLower) ||
      exam?.subjectName?.toLowerCase().includes(searchLower) ||
      exam?.subjectCode?.toLowerCase().includes(searchLower) ||
      deptString.toLowerCase().includes(searchLower)
    );
  });

  const fnCount = exams.filter((e) => e.session === "FN").length;
  const anCount = exams.filter((e) => e.session === "AN").length;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar />

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header Dashboard Banner */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                <FaFileInvoice className="text-blue-600" /> Assessment Scheduling Hub
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Establish examination timelines, index subject structures, and pool common departments together.
              </p>
            </div>
          </div>

          {/* Assessment Metrics Grid Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition duration-200 group">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Total Active Exams
                </h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
                  {exams.length}
                </h2>
              </div>
              <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                <FaFileInvoice />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition duration-200">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Session Balances (FN / AN)
                </h3>
                <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight flex items-center gap-2">
                  <span className="text-emerald-600 font-mono">{fnCount} FN</span>
                  <span className="text-slate-300 font-normal">|</span>
                  <span className="text-amber-600 font-mono">{anCount} AN</span>
                </h2>
              </div>
              <div className="bg-indigo-50 text-indigo-600 p-4 rounded-xl text-xl">
                <FaClock />
              </div>
            </div>

            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl p-6 flex justify-between items-center shadow-sm text-white">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Temporal Schema Sync
                </h3>
                <h2 className="text-lg font-bold text-white mt-2">
                  Registry State Active
                </h2>
              </div>
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Live Action Search Container */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/80 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition duration-200 relative group">
            <div className="pl-4 pr-3 text-slate-400 group-focus-within:text-blue-500 transition duration-150">
              <FaSearch className="text-base" />
            </div>
            <input
              type="text"
              placeholder="Filter assessments by Exam Name, Code, Subject Identifier, or Department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-12 py-3 text-sm font-semibold bg-transparent border-none outline-none text-slate-800 placeholder-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition duration-150"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {/* Form and Grid Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Input Form Column Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden lg:col-span-1">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
              
              <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">
                Create Assessment Target
              </h2>

              <form onSubmit={addExam} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Exam Event Label</label>
                  <input
                    type="text"
                    name="examName"
                    placeholder="e.g. End Semester Exams"
                    value={formData.examName}
                    onChange={handleChange}
                    className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 transition"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Subject Code</label>
                  <input
                    type="text"
                    name="subjectCode"
                    placeholder="e.g. CS8501"
                    value={formData.subjectCode}
                    onChange={handleChange}
                    className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-mono font-bold text-slate-800 transition"
                    required
                  />
                </div>

                {/* Target Departments Multi-Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wide uppercase block">
                    Target Departments (Select All Applicable)
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    {availableDepartments.map((dept) => {
                      const isSelected = formData.department.includes(dept);
                      return (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => handleDepartmentCheckbox(dept)}
                          className={`px-3 py-1.5 text-xs font-black rounded-lg border transition-all duration-150 ${
                            isSelected
                              ? "bg-blue-600 text-white border-transparent shadow-sm shadow-blue-100"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {dept}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Subject Full Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subjectName"
                      placeholder="e.g. Python Programming"
                      value={formData.subjectName}
                      onChange={handleChange}
                      className="w-full border border-slate-200 p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 transition"
                      required
                    />
                    <FaBookOpen className="absolute left-3.5 top-4 text-slate-400 text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Curriculum Year</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 transition cursor-pointer"
                      required
                    >
                      <option value="">Select</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Semester Level</label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 transition cursor-pointer"
                      required
                    >
                      <option value="">Select</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Sem {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Calendar Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border border-slate-200 p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-xs font-bold text-slate-700 transition cursor-pointer"
                        required
                      />
                      <FaCalendarAlt className="absolute left-3.5 top-4 text-slate-400 text-xs" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Meridian Session</label>
                    <div className="relative">
                      <select
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        className="w-full border border-slate-200 p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 transition cursor-pointer"
                        required
                      >
                        <option value="">Select</option>
                        <option value="FN">FN (Forenoon)</option>
                        <option value="AN">AN (Afternoon)</option>
                      </select>
                      <FaClock className="absolute left-3.5 top-4 text-slate-400 text-xs" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-sm shadow-blue-100 transition active:scale-95 text-sm"
                  >
                    <FaPlus /> Deploy Exam Matrix
                  </button>
                </div>
              </form>
            </div>

            {/* Matrix Data Grid Column Section */}
            <div className="lg:col-span-2 min-w-0 w-full">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Evaluation Matrix</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Time-series structural view maps of academic milestones.</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 border border-blue-100 rounded-full shrink-0">
                    {filteredExams.length} Blueprints Matched
                  </span>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold tracking-wider uppercase">
                        <th className="py-4 px-5">Target Event</th>
                        <th className="py-4 px-4 text-center">Subject Reference</th>
                        <th className="py-4 px-4">Core Structural Mapping</th>
                        <th className="py-4 px-4 text-center">Calendar Date</th>
                        <th className="py-4 px-4 text-center">Session Tag</th>
                        <th className="py-4 px-6 text-right">Operation Panel</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-semibold divide-y divide-slate-100 text-slate-700">
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <tr key={`sk-row-${i}`} className="animate-pulse">
                            <td colSpan="6" className="py-5 px-5">
                              <div className="h-5 bg-slate-100 rounded-lg w-full" />
                            </td>
                          </tr>
                        ))
                      ) : filteredExams.length > 0 ? (
                        filteredExams.map((exam, index) => {
                          const examId = exam._id || exam.id;
                          const formattedDate = exam.date ? exam.date.split("T")[0] : "Undated";

                          const displayedDepartments = Array.isArray(exam.department)
                            ? exam.department.join(", ")
                            : exam.department;

                          return (
                            <tr
                              key={examId || index}
                              className={`hover:bg-slate-50/80 transition duration-150 ${
                                index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                              }`}
                            >
                              <td className="py-4 px-5">
                                <div className="flex flex-col max-w-[160px] break-words">
                                  <span className="font-bold text-slate-900 leading-tight">
                                    {exam.examName || "Unlabeled Block"}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="flex flex-col items-center">
                                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-mono text-xs font-bold text-slate-900">
                                    {exam.subjectCode}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[130px] mt-1">
                                    {exam.subjectName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                  <span className="bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded text-blue-700 max-w-[180px] truncate" title={displayedDepartments}>
                                    {displayedDepartments}
                                  </span>
                                  <span className="text-slate-300">•</span>
                                  <span>Yr {exam.year}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-400">Sem {exam.semester || "-"}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center font-mono text-xs font-bold text-slate-600">
                                {formattedDate}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span
                                  className={`px-3 py-1 rounded-lg text-xs font-black border tracking-wider inline-block ${
                                    exam.session === "FN"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                      : "bg-amber-50 text-amber-700 border-amber-100"
                                  }`}
                                >
                                  {exam.session}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  type="button"
                                  onClick={() => deleteExam(examId)}
                                  className="bg-slate-50 hover:bg-red-600 text-red-600 hover:text-white border border-slate-200 hover:border-transparent p-2.5 rounded-xl transition duration-150 shadow-sm shrink-0"
                                  title="Decommission Exam"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-16 text-slate-400">
                            <div className="max-w-xs mx-auto space-y-1">
                              <p className="text-base font-bold text-slate-600">Zero Registry Vectors</p>
                              <p className="text-xs">Adjust your lookup criteria parameters within the main configuration search box.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Dynamic Evaluation Matrices Active</span>
                  <span className="text-slate-500 font-mono">Status Confirmed</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Exams;