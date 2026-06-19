const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: [true, "Exam name is required"],
      trim: true,
    },

    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
    },

    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },

    // --- FIXED: ALLOWS MULTIPLE DEPARTMENTS FOR COMMON SUBJECTS ---
    department: {
      type: [String], // Changed from String to Array of Strings to support common pooling
      required: [true, "At least one department is required"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "Department array cannot be empty."
      }
    },
    // --------------------------------------------------------------

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 1,
      max: 4,
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8,
    },

    date: {
      type: Date,
      required: [true, "Exam date is required"],
    },

    session: {
      type: String,
      enum: ["FN", "AN"],
      required: [true, "Session is required"],
    },

    duration: {
      type: String,
      default: "3 Hours",
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);