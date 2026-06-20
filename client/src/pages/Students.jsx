import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaUsers,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaFileExcel,
  FaSearch,
  FaEnvelope,
  FaTimes,
  FaGraduationCap
} from "react-icons/fa";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    email: "",
    department: "",
    year: "",
    section: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("https://smart-exam-seat-allocation-system.onrender.com/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(res.data.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
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

  // Sanitizes payload to ensure backend database validations don't choke on empty section values
  const preparePayload = () => {
    const payload = { ...formData };
    if (!payload.section || payload.section.trim() === "") {
      delete payload.section; // Or set to null/default depending on your Mongoose Schema requirements
    }
    return payload;
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const cleanData = preparePayload();
      await axios.post("https://smart-exam-seat-allocation-system.onrender.com/api/students", cleanData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Student Added Successfully");
      resetForm();
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to Add Student (Server Error 500)");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      regNo: student.regNo,
      name: student.name,
      email: student.email || "",
      department: student.department,
      year: student.year,
      section: student.section || "",
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const cleanData = preparePayload();
      await axios.put(
        `https://smart-exam-seat-allocation-system.onrender.com/api/students/${editingId}`,
        cleanData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Student Updated Successfully");
      setEditingId(null);
      resetForm();
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to Update Student (Server Error 500)");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`https://smart-exam-seat-allocation-system.onrender.com/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Student Deleted");
      fetchStudents();
    } catch (error) {
      alert("Delete Failed");
    }
  };

  const handleExcelImport = async () => {
    if (!excelFile) {
      alert("Please Select Excel File");
      return;
    }
    try {
      const data = new FormData();
      data.append("file", excelFile);
      await axios.post("https://smart-exam-seat-allocation-system.onrender.com/api/students/import", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Students Imported Successfully");
      setExcelFile(null);
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || "Import Failed");
    }
  };

  const resetForm = () => {
    setFormData({
      regNo: "",
      name: "",
      email: "",
      department: "",
      year: "",
      section: "",
    });
  };

  const filteredStudents = students.filter(
    (student) =>
      student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      student?.regNo?.toLowerCase().includes(search.toLowerCase()) ||
      student?.department?.toLowerCase().includes(search.toLowerCase())
  );

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
                <FaGraduationCap className="text-blue-600" /> Student Matrix Hub
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitor registries, modify data layers, and handle bulk file configurations natively.
              </p>
            </div>
          </div>

          {/* KPI Dashboard Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition duration-200 group">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Total Managed Ledger
                </h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
                  {students.length}
                </h2>
              </div>
              <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                <FaUsers />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition duration-200">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Filtered Set Size
                </h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
                  {filteredStudents.length}
                </h2>
              </div>
              <div className="bg-indigo-50 text-indigo-600 p-4 rounded-xl text-xl">
                <FaSearch />
              </div>
            </div>

            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl p-6 flex justify-between items-center shadow-sm text-white">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Active Configuration State
                </h3>
                <h2 className="text-lg font-bold text-white mt-2">
                  {editingId ? "Modification Protocol Active" : "Ready for Deployment Entry"}
                </h2>
              </div>
              <div className={`h-3 w-3 rounded-full ${editingId ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            </div>
          </div>

          {/* Live Action Search Container */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/80 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition duration-200 relative group">
            <div className="pl-4 pr-3 text-slate-400 group-focus-within:text-blue-500 transition duration-150">
              <FaSearch className="text-base" />
            </div>
            <input
              type="text"
              placeholder="Instantly isolate record profiles by Name, Register Reference Code, or Department..."
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

          {/* Two Column Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Form Column Section */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${editingId ? "bg-amber-500" : "bg-blue-600"}`} />
                
                <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">
                  {editingId ? "Update Student Parameters" : "Register Unique Identity Block"}
                </h2>

                <form onSubmit={editingId ? handleUpdateStudent : handleAddStudent} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Register Number</label>
                    <input
                      type="text"
                      name="regNo"
                      placeholder="e.g. 21IT102"
                      value={formData.regNo}
                      onChange={handleChange}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 transition"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Student Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Alexander Pierce"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 transition"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Institutional Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder="username@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-slate-200 p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 transition"
                        required
                      />
                      <FaEnvelope className="absolute left-3.5 top-4 text-slate-400 text-xs" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Department Module</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 transition cursor-pointer"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="IT">Information Technology (IT)</option>
                      <option value="CSE">Computer Science & Eng (CSE)</option>
                      <option value="ECE">Electronics & Comm (ECE)</option>
                      <option value="EEE">Electrical & Electronics (EEE)</option>
                      <option value="MECH">Mechanical Eng (MECH)</option>
                    </select>
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
                      <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Section Block</label>
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 transition cursor-pointer"
                      >
                        <option value="">None (Optional)</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                        <option value="E">Section E</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className={`w-full text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-sm transition active:scale-95 text-sm ${
                        editingId
                          ? "bg-amber-500 hover:bg-amber-600 shadow-amber-100"
                          : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                      }`}
                    >
                      {editingId ? (
                        <>
                          <FaSave /> Save Target Changes
                        </>
                      ) : (
                        <>
                          <FaPlus /> Initialize Profile
                        </>
                      )}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          resetForm();
                        }}
                        className="w-full bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 p-3 rounded-xl font-bold text-sm transition"
                      >
                        Abort Modification
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Advanced Excel Processing Dropzone Segment */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Bulk Matrix Ingestion</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Parse multidimensional sheets instantly.</p>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setExcelFile(e.target.files[0])}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition file:cursor-pointer border border-dashed border-slate-200 p-3 rounded-2xl bg-slate-50/50"
                  />
                  
                  <button
                    onClick={handleExcelImport}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-sm shadow-emerald-100 transition active:scale-95"
                  >
                    <FaFileExcel className="text-sm" /> Execute Database Merge
                  </button>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] font-medium text-slate-400 space-y-1">
                  <span className="font-bold text-slate-500 block">Mapping Schema Invariance:</span>
                  <p className="font-mono text-slate-600 tracking-tight break-all">
                    regNo, name, email, department, year, section
                  </p>
                </div>
              </div>
            </div>

            {/* Matrix Data Display Column Section */}
            <div className="lg:col-span-2 min-w-0 w-full">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Student Identity Ledger</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Active database view reflecting live filter targets</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 border border-blue-100 rounded-full shrink-0">
                    {filteredStudents.length} Profiles Matched
                  </span>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold tracking-wider uppercase">
                        <th className="py-4 px-4 text-center w-28">Identity Code</th>
                        <th className="py-4 px-4">Name Vector</th>
                        <th className="py-4 px-4 text-center">Module Core</th>
                        <th className="py-4 px-4 text-center">Batch Level</th>
                        <th className="py-4 px-4 text-center">Section Block</th>
                        <th className="py-4 px-4 text-right">Operation Panel</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-semibold divide-y divide-slate-100 text-slate-700">
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <tr key={`sk-row-${i}`} className="animate-pulse">
                            <td colSpan="6" className="py-5 px-4">
                              <div className="h-5 bg-slate-100 rounded-lg w-full" />
                            </td>
                          </tr>
                        ))
                      ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr
                            key={student._id || index}
                            className={`hover:bg-slate-50/80 transition duration-150 ${
                              index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                            }`}
                          >
                            <td className="py-4 px-4 text-center font-mono text-xs font-bold text-slate-900">
                              <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg inline-block">
                                {student.regNo}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col max-w-[200px] break-words">
                                <span className="font-bold text-slate-900 leading-tight">{student.name}</span>
                                <span className="text-xs text-slate-400 font-medium mt-0.5 tracking-tight">
                                  {student.email || "No email bound"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-slate-500">
                              {student.department}
                            </td>
                            <td className="py-4 px-4 text-center font-extrabold text-slate-800">
                              Year {student.year}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-black border inline-block ${
                                student.section
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                              }`}>
                                {student.section ? `Sec ${student.section}` : "N/A"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(student)}
                                  className="bg-slate-50 hover:bg-amber-500 text-slate-600 hover:text-white border border-slate-200 hover:border-transparent p-2.5 rounded-xl transition duration-150 shadow-sm shrink-0"
                                  title="Edit Entry"
                                >
                                  <FaEdit className="text-sm" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteStudent(student._id)}
                                  className="bg-slate-50 hover:bg-red-600 text-red-600 hover:text-white border border-slate-200 hover:border-transparent p-2.5 rounded-xl transition duration-150 shadow-sm shrink-0"
                                  title="Purge Entry"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-16 text-slate-400">
                            <div className="max-w-xs mx-auto space-y-1">
                              <p className="text-base font-bold text-slate-600">Zero Target Matches</p>
                              <p className="text-xs">Adjust your lookup tokens in the matrix filter box above.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Index Render Limit Active</span>
                  <span className="text-slate-500 font-mono">System Up-to-Date</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Students;