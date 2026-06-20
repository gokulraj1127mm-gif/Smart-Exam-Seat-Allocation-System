import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaSave,
} from "react-icons/fa";

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] =
    useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "https://smart-exam-seat-allocation-system.onrender.com/api/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Student?")) return;

    try {
      await axios.delete(
        `https://smart-exam-seat-allocation-system.onrender.com/api/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent({ ...student });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://smart-exam-seat-allocation-system.onrender.com/api/students/${editingStudent._id}`,
        editingStudent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Student Updated");

      setEditingStudent(null);

      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.regNo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.department
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">
          Student Management
        </h2>

        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-3">Reg No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Year</th>
              <th className="p-3">Section</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student._id}
                className="border-b"
              >
                <td className="p-3">
                  {student.regNo}
                </td>

                <td className="p-3">
                  {student.name}
                </td>

                <td className="p-3">
                  {student.department}
                </td>

                <td className="p-3">
                  {student.year}
                </td>

                <td className="p-3">
                  {student.section}
                </td>

                <td className="p-3">
                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(student)
                      }
                      className="bg-yellow-500 text-white px-3 py-2 rounded"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(student._id)
                      }
                      className="bg-red-500 text-white px-3 py-2 rounded"
                    >
                      <FaTrash />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingStudent && (
        <div className="mt-6 border p-5 rounded-lg bg-gray-50">

          <h3 className="text-xl font-bold mb-4">
            Edit Student
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              value={editingStudent.name}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  name: e.target.value,
                })
              }
              className="border p-3 rounded"
            />

            <input
              type="text"
              value={editingStudent.department}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  department: e.target.value,
                })
              }
              className="border p-3 rounded"
            />

            <input
              type="text"
              value={editingStudent.year}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  year: e.target.value,
                })
              }
              className="border p-3 rounded"
            />

            <input
              type="text"
              value={editingStudent.section}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  section: e.target.value,
                })
              }
              className="border p-3 rounded"
            />

          </div>

          <button
            onClick={handleUpdate}
            className="mt-4 bg-green-600 text-white px-5 py-3 rounded flex items-center gap-2"
          >
            <FaSave />
            Save Changes
          </button>

        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total Students: {filteredStudents.length}
      </div>

    </div>
  );
}

export default StudentTable;