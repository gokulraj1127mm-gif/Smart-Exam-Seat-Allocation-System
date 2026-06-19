import React, { useEffect, useState } from "react";
import axios from "axios";

function MySeat() {
  const [seat, setSeat] = useState(null);

  useEffect(() => {
    fetchSeat();
  }, []);

  const fetchSeat = async () => {
    try {
      const student = JSON.parse(
        localStorage.getItem("student")
      );

      const res = await axios.get(
        `http://localhost:5000/api/seatallocation/student/${student.regNo}`
      );

      setSeat(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4">
          My Seat Allocation
        </h1>

        {seat ? (
          <>
            <p>
              <strong>Hall:</strong>{" "}
              {seat.hallNo}
            </p>

            <p>
              <strong>Seat No:</strong>{" "}
              {seat.seatNo}
            </p>

            <p>
              <strong>Subject:</strong>{" "}
              {seat.subjectName}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                seat.examDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Session:</strong>{" "}
              {seat.session}
            </p>
          </>
        ) : (
          <p>No seat allocated yet.</p>
        )}
      </div>
    </div>
  );
}

export default MySeat;