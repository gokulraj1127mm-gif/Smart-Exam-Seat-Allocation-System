import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaDoorOpen,
  FaPlus,
  FaTrash,
  FaSearch,
  FaTimes,
  FaTh,
  FaUsers,
  FaColumns,
  FaLayerGroup
} from "react-icons/fa";

function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    hallNo: "",
    capacity: "",
    rows: "",
    columns: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/classrooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClassrooms(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching classrooms:", err);
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

  const addClassroom = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/classrooms", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Classroom Layer Created Successfully");
      setFormData({
        hallNo: "",
        capacity: "",
        rows: "",
        columns: "",
      });
      fetchClassrooms();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add classroom space.");
      console.error("Error adding classroom:", err);
    }
  };

  const deleteClassroom = async (id) => {
    if (!window.confirm("Are you sure you want to decommission this classroom space? This will permanently wipe all matrix seat allocations associated with this room.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/classrooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Classroom Purged and Dependent Matrices Synchronized");
      
      // CRITICAL FIX: Always pull fresh records from server to completely update dependencies 
      // and update calculations such as metrics, cards, and allocation dependencies.
      fetchClassrooms();
    } catch (err) {
      alert("Decommission Request Failed");
      console.error("Error deleting classroom:", err);
    }
  };

  // Live client-side lookup isolation
  const filteredClassrooms = classrooms.filter((room) =>
    room?.hallNo?.toLowerCase().includes(search.toLowerCase())
  );

  // Compute metrics dynamically based on live server registry data
  const totalCapacity = classrooms.reduce((acc, room) => acc + Number(room.capacity || 0), 0);

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
                <FaDoorOpen className="text-blue-600" /> Spatial Environment Hub
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Establish environmental dimensions, manage grid structural limits, and map matrix allocations.
              </p>
            </div>
          </div>

          {/* Infrastructure KPI Dashboard Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition duration-200 group">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Total Managed Halls
                </h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
                  {classrooms.length}
                </h2>
              </div>
              <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                <FaDoorOpen />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition duration-200 group">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Gross Seating Footprint
                </h3>
                <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
                  {totalCapacity}
                </h2>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-xl group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                <FaUsers />
              </div>
            </div>

            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl p-6 flex justify-between items-center shadow-sm text-white">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Structural Sync State
                </h3>
                <h2 className="text-lg font-bold text-white mt-2">
                  System Architecture Live
                </h2>
              </div>
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Spatial Live Search Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/80 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition duration-200 relative group">
            <div className="pl-4 pr-3 text-slate-400 group-focus-within:text-blue-500 transition duration-150">
              <FaSearch className="text-base" />
            </div>
            <input
              type="text"
              placeholder="Query hall identifiers directly (e.g. Hall 102)..."
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

          {/* Two Column Structural Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Entry Form Panel Column */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden lg:col-span-1">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
              
              <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">
                Initialize Space Layer
              </h2>

              <form onSubmit={addClassroom} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Hall Number Reference</label>
                  <input
                    type="text"
                    name="hallNo"
                    placeholder="e.g. Hall 301A"
                    value={formData.hallNo}
                    onChange={handleChange}
                    className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 transition"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Gross Unit Capacity</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="capacity"
                      placeholder="Max Desk Limit"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="w-full border border-slate-200 p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 transition"
                      required
                    />
                    <FaUsers className="absolute left-3.5 top-4 text-slate-400 text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Row Axis</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="rows"
                        placeholder="Y-Count"
                        value={formData.rows}
                        onChange={handleChange}
                        className="w-full border border-slate-200 p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 transition"
                        required
                      />
                      <FaLayerGroup className="absolute left-3.5 top-4 text-slate-400 text-xs" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Column Axis</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="columns"
                        placeholder="X-Count"
                        value={formData.columns}
                        onChange={handleChange}
                        className="w-full border border-slate-200 p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 transition"
                        required
                      />
                      <FaColumns className="absolute left-3.5 top-4 text-slate-400 text-xs" />
                    </div>
                  </div>
                </div>

                {/* Micro Preview of Grid Dimensions */}
                {formData.rows && formData.columns && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><FaTh className="text-slate-400" /> Structural Matrix:</span>
                    <span className="font-mono text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      {formData.rows} × {formData.columns} Elements
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-sm shadow-blue-100 transition active:scale-95 text-sm"
                  >
                    <FaPlus /> Deploy Structural Space
                  </button>
                </div>
              </form>
            </div>

            {/* Matrix Data Display Ledger Column */}
            <div className="lg:col-span-2 min-w-0 w-full">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Environmental Topology Ledger</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Active physical configurations currently mapped online</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 border border-blue-100 rounded-full shrink-0">
                    {filteredClassrooms.length} Spaces Detected
                  </span>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold tracking-wider uppercase">
                        <th className="py-4 px-6 text-left">Hall Identity Block</th>
                        <th className="py-4 px-4 text-center">Gross Capacity</th>
                        <th className="py-4 px-4 text-center">Matrix Bounds (R × C)</th>
                        <th className="py-4 px-6 text-right">Operation Panel</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-semibold divide-y divide-slate-100 text-slate-700">
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <tr key={`sk-row-${i}`} className="animate-pulse">
                            <td colSpan="4" className="py-5 px-6">
                              <div className="h-5 bg-slate-100 rounded-lg w-full" />
                            </td>
                          </tr>
                        ))
                      ) : filteredClassrooms.length > 0 ? (
                        filteredClassrooms.map((room, index) => {
                          const roomId = room._id || room.id;
                          return (
                            <tr
                              key={roomId || index}
                              className={`hover:bg-slate-50/80 transition duration-150 ${
                                index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                              }`}
                            >
                              <td className="py-4 px-6 font-black text-slate-900">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-2 bg-slate-100 text-slate-500 rounded-xl text-xs">
                                    <FaDoorOpen />
                                  </div>
                                  <span className="tracking-tight">{room.hallNo}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center font-extrabold text-slate-800">
                                <span className="bg-slate-100/80 border border-slate-200/60 px-2.5 py-1 rounded-lg font-mono inline-block text-xs">
                                  {room.capacity} Units
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="bg-blue-50/50 text-blue-600 border border-blue-100/50 px-2.5 py-1 rounded-lg text-xs font-mono font-bold inline-block">
                                  {room.rows} × {room.columns}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  type="button"
                                  onClick={() => deleteClassroom(roomId)}
                                  className="bg-slate-50 hover:bg-red-600 text-red-600 hover:text-white border border-slate-200 hover:border-transparent p-2.5 rounded-xl transition duration-150 shadow-sm shrink-0"
                                  title="Decommission Space"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-16 text-slate-400">
                            <div className="max-w-xs mx-auto space-y-1">
                              <p className="text-base font-bold text-slate-600">Zero Structural Matches</p>
                              <p className="text-xs">Adjust your lookup criteria in the top lookup bar context.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Topology Vector Matrix Active</span>
                  <span className="text-slate-500 font-mono">System Clean</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Classrooms;