import React from "react";

function SeatGrid({ seats = [] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Seating Arrangement
      </h2>

      {seats.length === 0 ? (
        <p className="text-gray-500">No seat allocation available.</p>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {seats.map((seat, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 text-center bg-blue-50 hover:bg-blue-100 transition"
            >
              <h3 className="font-bold text-blue-700">
                {seat.seatNo}
              </h3>

              <p className="text-sm text-gray-700 mt-1">
                {seat.student}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SeatGrid;