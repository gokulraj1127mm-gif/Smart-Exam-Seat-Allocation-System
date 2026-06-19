const mongoose = require("mongoose");

const seatAllocationSchema = new mongoose.Schema(
  {
    // Relational References (Crucial for deep queries and aggregations)
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    // Student Information (Denormalized for quick, efficient frontend lookup)
    regNo: {
      type: String,
      required: true,
      index: true, // Speeds up student-dashboard loading execution loops
    },
    studentName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },

    // Seating/Hall Details
    hallNo: {
      type: String,
      required: true,
      index: true, // Speeds up hall grid matrix generation fetching queries
    },
    seatNo: {
      type: String,
      required: true,
    },

    // Exam/Subject Details (Denormalized for instant rendering without deep population joins)
    subjectCode: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    session: {
      type: String, // Expected: "FN" or "AN"
      required: true,
    },
  },
  {
    // Automatically injects and handles operational lifecycle metrics: createdAt & updatedAt
    timestamps: true, 
  }
);

// Compound index to strictly block double-booking an identical seat slot for the same exam time frame
seatAllocationSchema.index(
  { hallNo: 1, seatNo: 1, examDate: 1, session: 1 }, 
  { unique: true }
);

// Prevent re-compilation errors if this model is loaded elsewhere in the backend workspace
module.exports = mongoose.models.SeatAllocation || mongoose.model("SeatAllocation", seatAllocationSchema);